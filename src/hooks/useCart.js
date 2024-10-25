import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import toast from "react-hot-toast"

const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart")
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    const [data] = useState(db);
    const [cart, setCart] = useState(initialCart);
    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))

    }, [cart])

    const addToCart = (item) => {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            //caso donde existe en el carrito
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            //no existe, agregandolo
            item.quantity = 1
            setCart([...cart, item]);
        }

    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)

        )
        toast.success("Elemento eliminado con exito")
    }

    const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            } return item
        })

        setCart(updatedCart)
    }

    const decreaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            } return item
        })

        setCart(updatedCart)
    }

    const clearCart = () => {
        setCart([])
    }

    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart
