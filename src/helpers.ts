import { isRef } from 'vue'

export const unwrap = (value: any) => {
  return isRef(value) ? value.value : value
}
