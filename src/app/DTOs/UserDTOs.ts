export interface UserDTO {
    username: string,
    firstName: string,
    lastName: string,
    email: string    
}

export interface UserLoginDTO {
    username: string,
    password: string
}

export interface UserRegisterDTO {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
}