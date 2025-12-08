import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type CartItem = {
    meal_id: number;
    name: string;
    price: number;
    quantity: number;
};

const STORAGE_KEY = 'burger_resturant_cart';

type CartContextValue = {
    items: CartItem[];
    total: number;
    hydrated: boolean;
    addItem: (item: CartItem) => void;
    updateQuantity: (mealId: number, quantity: number) => void;
    removeItem: (mealId: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as CartItem[];
                setItems(parsed);
            } catch {
                setItems([]);
            }
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const total = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + item.quantity * Number(item.price ?? 0),
                0,
            ),
        [items],
    );

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((p) => p.meal_id === item.meal_id);
            if (existing) {
                return prev.map((p) =>
                    p.meal_id === item.meal_id
                        ? { ...p, quantity: p.quantity + item.quantity }
                        : p,
                );
            }
            return [...prev, item];
        });
    };

    const updateQuantity = (mealId: number, quantity: number) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.meal_id === mealId ? { ...item, quantity } : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const removeItem = (mealId: number) => {
        setItems((prev) => prev.filter((item) => item.meal_id !== mealId));
    };

    const clear = () => setItems([]);

    const value: CartContextValue = {
        items,
        total,
        hydrated,
        addItem,
        updateQuantity,
        removeItem,
        clear,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within CartProvider');
    }

    return ctx;
}
