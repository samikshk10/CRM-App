import { UserInterface } from '.'
export interface ContextInterface {
    user: UserInterface | undefined
    authorization?: string | undefined
}