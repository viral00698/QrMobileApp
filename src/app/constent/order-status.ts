export enum OrderStatus {
    Pending = 'PENDING',
    Ongoing = 'ONGOING',
    NotApproved = 'NOT_APPROVED',
    Placed = 'PLACED',  // Order has been placed by the customer
    Cancelled = 'CANCELLED',  // Order has been cancelled
    Confirmed = 'CONFIRMED', // Order has been confirmed by the restaurant
    ReadyForPickup = 'READY_FOR_PICKUP',
    WaitForApprove = 'WAIT_FOR_APPROVE',
    Approved='APPROVED',
    Complete='COMPLETE'
}
