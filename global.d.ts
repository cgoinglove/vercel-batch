type Serializable = string | number | boolean | null | Array<Serializable> | SerializableObject

interface SerializableObject {
  [key: string]: Serializable
}
type Func<Args extends any[] = any[], ReturnValue = any> = (...args: Args) => ReturnValue

type ElementType<T> = T extends (infer U)[] ? U : never

type ValueOf<T extends object> = T[keyof T]

type PickPartial<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>

interface Nothing {
  __________noting: Nothing
}
