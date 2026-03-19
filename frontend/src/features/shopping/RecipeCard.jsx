import { useState } from 'react'
import { ChefHat, Trash2, ShoppingBag } from 'lucide-react'
import Button from '@/components/UI/Button'
import ConfirmDialog from '@/components/UI/ConfirmDialog'
import { useDeleteRecipe, useGenerateShoppingFromRecipe } from '@/hooks/useShopping'

export default function RecipeCard({ recipe }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteRecipe = useDeleteRecipe()
  const generate = useGenerateShoppingFromRecipe()
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []

  return (
    <>
      <div className="glass-card glass-card-hover p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent2/15 flex items-center justify-center">
              <ChefHat size={16} className="text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{recipe.name}</p>
              <p className="text-xs text-muted">{recipe.servings} порц. · {ingredients.length} ингредиентов</p>
            </div>
          </div>
          <button onClick={() => setConfirmDelete(true)} className="text-muted hover:text-danger transition-colors p-1" aria-label="Удалить рецепт">
            <Trash2 size={14} />
          </button>
        </div>

        {recipe.description && (
          <p className="text-xs text-muted mb-3 line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {ingredients.slice(0, 4).map((ing, i) => (
            <span key={i} className="px-2 py-0.5 bg-white/5 rounded-lg text-xs text-muted">
              {ing.name}
            </span>
          ))}
          {ingredients.length > 4 && (
            <span className="px-2 py-0.5 bg-white/5 rounded-lg text-xs text-muted">
              +{ingredients.length - 4}
            </span>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          loading={generate.isPending}
          onClick={() => generate.mutate(recipe.id)}
        >
          <ShoppingBag size={14} />
          Добавить в список
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteRecipe.mutate(recipe.id, { onSuccess: () => setConfirmDelete(false) })}
        title="Удалить рецепт?"
        message={`«${recipe.name}» будет удалён.`}
        loading={deleteRecipe.isPending}
      />
    </>
  )
}
