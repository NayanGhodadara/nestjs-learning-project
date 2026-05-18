export enum Validation {
    PATTERN_PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
}

export enum LanguageEnum {
    EN = 'en',
    GU = 'guj',
}

export const ProviderType = {
    SYSTEM: "system",
    APPLE: "apple",
    GOOGLE: "google"
}

export enum UserType {
    CUSTOMER = "customer",
    ADMIN = "admin",
    VENDOR = "vendor",
    DRIVER = "driver"
}

export enum GenderType {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export enum DocumentType {
    LICENSE = "license",
    PANCARD = "pancard",
    PRODUCT = "product"
}

export enum AddressType {
    HOME = "home",
    WORK = "work",
    OTHER = "other"
}

export enum OrderType {
    INSTANT = "instant",
    SCHEDULE = "schedule"
}

export enum OrderStatus {
    PENDING = "pending",
    ACCEPTED_BY_VENDOR = "acceptdByVendor",
    READY_TO_SHIP = "readyToShip",
    ACCEPTED_BY_DRIVER = "acceptedByDriver",
    ORDER_START = "orderStart",
    ORDER_PICKUP = "orderPickUp",
    ORDER_DELIVER = "orderDeliver"
}

export enum ReminderType {
    ONE_TIME = 'onetime',
    EVERYDAY = 'everyday',
    EVERYWEEK = 'everyweek',
    EVERYMONTH = 'everymonth',
    EVERYYEAR = 'everyyear',
}