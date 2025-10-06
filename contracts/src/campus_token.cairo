/// @title CampusToken - ERC20 Token for Campus Ecosystem
/// @notice A custom ERC20 token with check-in rewards and campus store payment features
/// @dev Compatible with OpenZeppelin ERC20 standard with additional campus-specific functions
/// Built for StarkNet Re{Solve} Hackathon - Mobile-First dApps & Payments Track

use starknet::ContractAddress;

#[starknet::interface]
trait ICampusToken<TContractState> {
    fn name(self: @TContractState) -> ByteArray;
    fn symbol(self: @TContractState) -> ByteArray;
    fn decimals(self: @TContractState) -> u8;
    fn total_supply(self: @TContractState) -> u256;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
    fn check_in(ref self: TContractState) -> bool;
    fn purchase(ref self: TContractState, store_address: ContractAddress, amount: u256) -> bool;
}

#[starknet::contract]
mod CampusToken {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use core::num::traits::Zero;

    #[storage]
    struct Storage {
        name: ByteArray,
        symbol: ByteArray,
        decimals: u8,
        total_supply: u256,
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
        owner: ContractAddress,
        last_checkin: Map<ContractAddress, u64>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Transfer: Transfer,
        Approval: Approval,
        CheckInReward: CheckInReward,
    }

    #[derive(Drop, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        value: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct Approval {
        owner: ContractAddress,
        spender: ContractAddress,
        value: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct CheckInReward {
        user: ContractAddress,
        amount: u256,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.name.write("CampusToken");
        self.symbol.write("CPT");
        self.decimals.write(18);
        self.owner.write(initial_owner);
        self.total_supply.write(0);
    }

    #[abi(embed_v0)]
    impl CampusTokenImpl of super::ICampusToken<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.name.read()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.symbol.read()
        }

        fn decimals(self: @ContractState) -> u8 {
            self.decimals.read()
        }

        fn total_supply(self: @ContractState) -> u256 {
            self.total_supply.read()
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            self.balances.entry(account).read()
        }

        fn allowance(self: @ContractState, owner: ContractAddress, spender: ContractAddress) -> u256 {
            self.allowances.entry((owner, spender)).read()
        }

        fn transfer(ref self: ContractState, recipient: ContractAddress, amount: u256) -> bool {
            let sender = get_caller_address();
            self._transfer(sender, recipient, amount);
            true
        }

        fn approve(ref self: ContractState, spender: ContractAddress, amount: u256) -> bool {
            let owner = get_caller_address();
            self.allowances.entry((owner, spender)).write(amount);
            self.emit(Approval { owner, spender, value: amount });
            true
        }

        fn transfer_from(
            ref self: ContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) -> bool {
            let caller = get_caller_address();
            let current_allowance = self.allowances.entry((sender, caller)).read();
            assert(current_allowance >= amount, 'Insufficient allowance');
            self.allowances.entry((sender, caller)).write(current_allowance - amount);
            self._transfer(sender, recipient, amount);
            true
        }

        /// @notice Daily check-in to earn campus tokens
        /// @dev Enforces 24-hour cooldown to prevent spam and ensure fair distribution
        /// @return bool Success status of the check-in operation
        fn check_in(ref self: ContractState) -> bool {
            let caller = get_caller_address();
            let current_time = starknet::get_block_timestamp();

            // Anti-spam protection: Enforce 24-hour cooldown between check-ins
            let last_time = self.last_checkin.entry(caller).read();
            let cooldown: u64 = 86400; // 24 hours in seconds
            if last_time != 0 {
                assert(
                    current_time >= last_time + cooldown,
                    'Check-in cooldown: 24h required'
                );
            }

            // Mint check-in reward: 10 CPT tokens
            let reward_amount: u256 = 10_000_000_000_000_000_000; // 10 CPT (10 * 10^18)

            let current_balance = self.balances.entry(caller).read();
            self.balances.entry(caller).write(current_balance + reward_amount);

            let current_supply = self.total_supply.read();
            self.total_supply.write(current_supply + reward_amount);

            self.last_checkin.entry(caller).write(current_time);

            self.emit(Transfer {
                from: Zero::zero(),
                to: caller,
                value: reward_amount,
            });
            self.emit(CheckInReward {
                user: caller,
                amount: reward_amount,
                timestamp: current_time,
            });

            true
        }

        fn purchase(ref self: ContractState, store_address: ContractAddress, amount: u256) -> bool {
            let caller = get_caller_address();
            self._transfer(caller, store_address, amount);
            true
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _transfer(
            ref self: ContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256
        ) {
            assert(!sender.is_zero(), 'Transfer from zero');
            assert(!recipient.is_zero(), 'Transfer to zero');

            let sender_balance = self.balances.entry(sender).read();
            assert(sender_balance >= amount, 'Insufficient balance');

            self.balances.entry(sender).write(sender_balance - amount);
            let recipient_balance = self.balances.entry(recipient).read();
            self.balances.entry(recipient).write(recipient_balance + amount);

            self.emit(Transfer { from: sender, to: recipient, value: amount });
        }
    }
}