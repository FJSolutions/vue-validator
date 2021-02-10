# Change Log

- Alpha releases (working version, but API still evolving)

## 0.6.0

### Rule & Group Validation Configuration

- Public interfaces have had the initial 'I' removed from their names.
- An isPending property has been added to the root and group Validators which is true while validation is in progress.
- Rule & Group configuration has been simplified.
  - Intellisense for both is now fully working, both for configuration and in the output.
  - Group configuration is now separate from the property rule definitions.

## 0.5.2

### Message Function

- Rule `message` can also be a function which receives a `context` object with properties for the message
  - Current value of the property
  - Rule name
  - Property name
  - Min (for number)
  - Max (for number)
  - Min Length (for string)
  - Max Length (for string)

## 0.5.1

- Fully `reactive` Validator object created around the `model` supplied.
- First working prototype of the module.
