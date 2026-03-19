import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ShoppingItem from '@/features/shopping/ShoppingItem'
import ShoppingForm from '@/features/shopping/ShoppingForm'
import RecipeCard from '@/features/shopping/RecipeCard'
import EmptyState from '@/components/UI/EmptyState'
import Skeleton from '@/components/UI/Skeleton'
import Button from '@/components/UI/Button'
import { useShoppingItems, useRecipes } from '@/hooks/useShopping'
import { groupBy, formatCurrency } from '@/utils/formatters'

const TABS = [
  { value: 'list', label: 'Список покупок' },
  { value: 'recipes', label: 'Рецепты' }
]

const CATEGORY_LABELS = {
  dairy: 'Молочное', vegetables: 'Овощи', fruits: 'Фрукты',
  meat: 'Мясо', bakery: 'Выпечка', drinks: 'Напитки',
  household: 'Хозтовары', other: 'Другое'
}

export default function Shopping() {
  const [tab, setTab] = useState('list')
  const { data: items = [], isPending: itemsPending, isError: itemsError, refetch } = useShoppingItems()
  const { data: recipes = [], isPending: recipesPending } = useRecipes()

  const unchecked = items.filter((i) => !i.checked)
  const checked = items.filter((i) => i.checked)
  const total = unchecked.reduce((s, i) => s + (i.price ? i.price * i.qty : 0), 0)
  const grouped = groupBy(unchecked, 'category')

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold font-display text-white">Покупки</h1>
        <span className="text-sm text-muted">{unchecked.length} товаров</span>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.value
                ? 'bg-accent/15 text-accent border border-accent/25'
                : 'text-muted bg-white/4 border border-transparent hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <div className="space-y-4">
          <ShoppingForm />

          {itemsPending ? (
            <Skeleton count={3} />
          ) : itemsError ? (
            <EmptyState type="error" action={refetch} />
          ) : unchecked.length === 0 && checked.length === 0 ? (
            <EmptyState title="Список пуст" description="Добавьте товары выше" />
          ) : (
            <>
              {Object.entries(grouped).map(([category, catItems]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    {CATEGORY_LABELS[category] || category}
                  </p>
                  <div className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {catItems.map((item) => (
                        <ShoppingItem key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}

              {checked.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                    Куплено ({checked.length})
                  </p>
                  <div className="space-y-1.5 opacity-60">
                    <AnimatePresence initial={false}>
                      {checked.map((item) => (
                        <ShoppingItem key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'recipes' && (
        <div>
          {recipesPending ? (
            <Skeleton count={3} />
          ) : recipes.length === 0 ? (
            <EmptyState title="Рецептов нет" description="Рецепты можно будет добавить здесь" />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'list' && total > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 flex items-center gap-4 shadow-xl border-accent/20 pointer-events-none">
          <span className="text-sm text-muted">{unchecked.length} товаров</span>
          <span className="text-white font-bold font-display text-lg">≈ {formatCurrency(total)}</span>
        </div>
      )}
    </div>
  )
}
