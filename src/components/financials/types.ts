export interface RentData {
  id: string
  property: string
  unit: string
  tenant: string
  dueDate: string
  amount: number
  status: string
}

export interface PaymentResponse {
  id: string
  due_date: string
  amount: number
  status: string
  lease: {
    tenant: {
      full_name: string
    }
    unit: {
      unit_name: string
      property: {
        name: string
      }
    }
  }
}