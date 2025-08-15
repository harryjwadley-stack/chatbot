
import re

class EntityExtractor:
    def __init__(self, order_data, account_data):
        # Define patterns for extracting order ID and account number
        self.order_id_pattern = r"order\s#(\d+)"
        self.account_number_pattern = r"account\s#(\d+)"
        
        # Example data to simulate backend data retrieval
        self.order_data = order_data
        self.account_data = account_data

        self.user_data = {'account_number': None, 'order_id': None}
    
    def extract_entities(self, user_input):
        """
        Extract entities like order ID or account number from the user input.

        Parameters:
        user_input (str): The user's query string

        Returns:
        dict: A dictionary with extracted entities (e.g., order_id, account_number)
        """
        entities = {}

        # Extract order ID if it exists in the user input
        order_id_match = re.search(self.order_id_pattern, user_input, re.IGNORECASE)

        if order_id_match:
            entities["order_id"] = order_id_match.group(1)

        # Extract account number if it exists in the user input
        account_number_match = re.search(self.account_number_pattern, user_input, re.IGNORECASE)
        if account_number_match:
            entities["account_number"] = account_number_match.group(1)

        return entities
    
    def get_order_status(self, order_id):
        """Retrieve order status from the order data dictionary."""
        return self.order_data.get(order_id, {"status": "Not found", "delivery_date": "N/A"})
    
    def get_account_balance(self, account_number):
        """Retrieve account balance from the account data dictionary."""
        return self.account_data.get(account_number, {"balance": "Not found", "last_payment": "N/A"})

    def store_user_data(self, user_id, entities):
        """
        Store extracted user data (order ID or account number) into the user_data dictionary.

        Parameters:
        user_id (str): A unique identifier for the user (e.g., username, session ID)
        entities (dict): The extracted entities (order_id, account_number)
        if user_id not in self.user_data:
            self.user_data[user_id] = {}
        """
        
        # Store the extracted order ID and/or account number under the user_id
        if "order_id" in entities:
            self.user_data["order_id"] = entities["order_id"]
        if "account_number" in entities:
            self.user_data["account_number"] = entities["account_number"]
        
        return self.user_data

def main():

    # Example data to simulate backend data retrieval
    order_data = {
        "123": {"status": "shipped", "delivery_date": "2025-08-10"},
        "456": {"status": "processing", "delivery_date": "2025-08-15"}
    }
    account_data = {
        "132": {"balance": "$120.50", "last_payment": "2025-07-20"},
        "456": {"balance": "$45.00", "last_payment": "2025-07-10"}
    }

    # Create an instance of the EntityExtractor class
    entity_extractor = EntityExtractor(order_data, account_data)

    print("Hello!")

    while True:
        # Ask the user for their preference
        choice = input("Would you like to check your order ID or account number? (Type 'order' or 'account'): ").strip().lower()

        # Ask the user for their unique user ID (can be username, email, or session ID)
        user_id = input(f"Please provide your user {choice} ID: ").strip()
        entities = entity_extractor.extract_entities(choice+' #'+user_id)
        # Check if the user wants to check the order ID or account number
        if choice == 'order':
            
            if "order_id" in entities:
                order_status = entity_extractor.get_order_status(entities["order_id"])
                print(f"Order ID: {entities['order_id']} - Status: {order_status['status']}, Delivery Date: {order_status['delivery_date']}")
            else:
                print("Sorry, I couldn't find an order ID in your input.")
        
        elif choice == 'account':

            if "account_number" in entities:
                account_balance = entity_extractor.get_account_balance(entities["account_number"])
                print(f"Account Number: {entities['account_number']} - Balance: {account_balance['balance']}, Last Payment: {account_balance['last_payment']}")
            else:
                print("Sorry, I couldn't find an account number in your input.")
        
        else:
            print("Sorry, I didn't understand your choice. Please type 'order' or 'account'.")
            
        # Display all stored data for the user (for debugging/verification purposes)
        print("\nStored User Data:")
        entity_extractor.store_user_data(user_id, entities)
        print(entity_extractor.store_user_data(user_id, entities))

        another_query = input("Would you like to check anything else? (yes/no): ").strip().lower()
        if another_query != 'yes':
            print("Thank you for using our service! Have a great day!")
            break


if __name__ == "__main__":
    main()
