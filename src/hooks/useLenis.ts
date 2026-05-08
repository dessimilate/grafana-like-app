import Lenis from 'lenis'
import { createContext, useContext } from 'react'

export const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)
