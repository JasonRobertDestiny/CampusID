/// @title StudentNFT - ERC721 Student Certificate
/// @notice NFT-based student identity certificates for campus ecosystem
/// @dev OpenZeppelin ERC721-compatible implementation with student metadata
/// @custom:security One NFT per address limit enforced
/// Built for StarkNet Re{Solve} Hackathon - Privacy & Identity Track

use starknet::ContractAddress;

#[starknet::interface]
trait IStudentNFT<TContractState> {
    /// @notice Mint a new student certificate NFT
    /// @dev Can only mint once per address, enforced by user_has_nft mapping
    /// @param avatar_uri IPFS or HTTP URL for student avatar image
    /// @param student_name Full name of the student
    /// @param student_id Unique student identifier (e.g., STU202401)
    /// @return token_id The newly minted NFT token ID
    fn mint_student_nft(
        ref self: TContractState,
        avatar_uri: ByteArray,
        student_name: ByteArray,
        student_id: ByteArray
    ) -> u256;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn owner_of(self: @TContractState, token_id: u256) -> ContractAddress;
    fn get_student_info(self: @TContractState, token_id: u256) -> (ByteArray, ByteArray, ByteArray);
    fn has_nft(self: @TContractState, account: ContractAddress) -> bool;
}

#[starknet::contract]
mod StudentNFT {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        name: Map<u256, ByteArray>,
        owner_of: Map<u256, ContractAddress>,
        balance_of: Map<ContractAddress, u256>,
        token_id_counter: u256,
        student_info: Map<u256, StudentInfo>,
        user_has_nft: Map<ContractAddress, bool>,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct StudentInfo {
        avatar_uri: ByteArray,
        student_name: ByteArray,
        student_id: ByteArray,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Transfer: Transfer,
        StudentNFTMinted: StudentNFTMinted,
    }

    #[derive(Drop, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct StudentNFTMinted {
        to: ContractAddress,
        token_id: u256,
        student_name: ByteArray,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.token_id_counter.write(1);
    }

    #[abi(embed_v0)]
    impl StudentNFTImpl of super::IStudentNFT<ContractState> {
        fn mint_student_nft(
            ref self: ContractState,
            avatar_uri: ByteArray,
            student_name: ByteArray,
            student_id: ByteArray
        ) -> u256 {
            let caller = get_caller_address();

            // Check if user already has an NFT
            assert(!self.user_has_nft.entry(caller).read(), 'User already has NFT');

            let token_id = self.token_id_counter.read();

            // Mint NFT
            self.owner_of.entry(token_id).write(caller);
            let current_balance = self.balance_of.entry(caller).read();
            self.balance_of.entry(caller).write(current_balance + 1);

            // Store student info
            let info = StudentInfo {
                avatar_uri,
                student_name: student_name.clone(),
                student_id,
            };
            self.student_info.entry(token_id).write(info);
            self.user_has_nft.entry(caller).write(true);

            // Increment counter
            self.token_id_counter.write(token_id + 1);

            // Emit events
            self.emit(Transfer {
                from: Zero::zero(),
                to: caller,
                token_id,
            });
            self.emit(StudentNFTMinted {
                to: caller,
                token_id,
                student_name,
            });

            token_id
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balance_of.entry(account).read()
        }

        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            self.owner_of.entry(token_id).read()
        }

        fn get_student_info(self: @ContractState, token_id: u256) -> (ByteArray, ByteArray, ByteArray) {
            let info = self.student_info.entry(token_id).read();
            (info.avatar_uri, info.student_name, info.student_id)
        }

        fn has_nft(self: @ContractState, account: ContractAddress) -> bool {
            self.user_has_nft.entry(account).read()
        }
    }
}