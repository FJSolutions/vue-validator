# Change Log

- Alpha releases (working version, but API still evolving)

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
