import { DndProvider } from 'react-dnd'
import DraggableBlock from '@/components/DraggableBlock'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase-server'

async function getWebsite(userId: string) {
  const { data, error } = await supabase
    .from('Websites')
    .select('*, Blocks(*)')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

async function addBlock(formData: FormData) {
  'use server'

  const websiteId = formData.get('websiteId') as string
  const blockTypeId = formData.get('blockTypeId') as string

  const { error } = await supabase.from('Blocks').insert({
    website_id: websiteId,
    block_type_id: blockTypeId,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    order_index: 0,
    content: {}
  })

  if (error) throw error

  revalidatePath('/cv-builder')
}

function ClientWrapper({ children }: { children: React.ReactNode }) {
  'use client'
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
export default async function CVBuilderPage({
  params
}: {
  params: { userId: string }
}) {
  const website = await getWebsite(params.userId)
  return (
    <ClientWrapper>
      <div>
        <h1>{website.title}</h1>
        <div>
          {website.Blocks.map((block: any) => (
            <DraggableBlock key={block.id} block={block} onUpdate={addBlock} />
          ))}
        </div>
        {/* Add Block form */}
      </div>
    </ClientWrapper>
  )
}
