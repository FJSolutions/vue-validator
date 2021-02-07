# Vue-Validator Features

## Messages

- Message function which receives a `context` object with properties for the message
  - Value (any)
  - Rule Name (string)
  - Min (for number)
  - Max (for number)
  - Min Length (for string)
  - Max Length (for string)
- Make the rule name property optional in the type
  - But define it for all built-in rules
  - Add the rule name to the `context`

## Rule Configuration

- Refactor and simplify Rule configuration 
  - Remove the 'builder façade' 
  - Streamline the types
  - Return a fully typed validator object 

## Models

- Investigate model options
  - Ref properties
  - Reactive object
  - Making properties Ref
- Document model caveats

## Documentation

- Update documentation
  - Basic usage
  - Model section
  - Rule section section
  - Groups

## Built-In Validators

- RequiredIf
- RequiredUnless
- And
- Or
- Not