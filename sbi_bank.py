class SBIATM:
    def __init__(self):
        self.pin = ""
        self.balance = 0
    def menu(self):
        while True:
            user_input = input('''
                                    Hello, How would you like to Proceed?
                                    1.Enter 1 to Create a PIN
                                    2.Enter 2 to deposit Money
                                    3.Enter 3 to withdraw Cash
                                    4.Enter 4 to check balance
                                    5.Enter 5 to Change Your pin
                                    6.Enter 6 to Exit
                                    --->>> Enter Your Choice : ''')
            if user_input == '1':
                self.create_pin()
            elif user_input == '2':
                self.deposit()
            elif user_input == '3':
                self.withdraw()
            elif user_input == '4':
                self.check_balance()
            elif user_input == '5':
                self.change_pin()
            elif user_input == '6':
                print("THANKS FOR USING OUR ATM")
                break
            else:
                print("Invalid choice. Please try again.")
    def create_pin(self):
        self.pin = input("Please Enter Your PIN (To Create):")
        print("Pin Set Successfully...")
    def deposit(self):
        temp = input("Enter Your PIN (To deposit) : ")
        if temp == self.pin:
            amount = int(input("Enter Your Amount :"))
            self.balance = self.balance + amount
            print("Deposit Successfully...")
        else:
            print("Invalid PIN !!!")
    def withdraw(self):
        temp = input("Enter your PIN (To Withdraw) : ")
        if temp == self.pin:
            amount = int(input("Enter the amount : "))
            if amount < self.balance:
                self.balance = self.balance - amount
                print("Withdraw successful")
            else:
                print("Insufficient fund")
        else:
            print("invalid pin")
    def check_balance(self):
        temp = input("Enter your PIN (To check Balance) : ")
        if temp == self.pin:
            print("your balance is : ", self.balance)
        else:
            print("invalid pin")
    def change_pin(self):
        temp = input("Enter Your Old Pin : ")
        if temp == self.pin:
            new_pin = input("Enter Your New PIN : ")
            self.pin = new_pin
            print("Pin Changed Successfully...")
        else:
            print("Invalid PIN !!! Try again...")
sbi = SBIATM()
sbi.menu()
