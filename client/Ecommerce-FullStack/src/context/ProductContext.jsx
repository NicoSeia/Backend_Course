import { createContext, useContext } from "react"
import { addProductRequest } from "../api/auth"


export const ProductContext = createContext()

export const useProductContext = () => {
    const context = useContext(ProductContext)
    if(!context){
        throw new Error("useProductContext must be used within an ProductProvider")
    }
    return context
}

const ProductProvider = ({children}) => {

    const addProduct = async ( product ) =>{
        try {
            const res = await addProductRequest(product)
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <ProductContext.Provider value={{
        addProduct
    }}>
        {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider