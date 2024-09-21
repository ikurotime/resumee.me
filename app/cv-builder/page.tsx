import { addBlock, getWebsite } from '@/actions/websites'

import { ClientWrapper } from '@/components/ClientWrapper'
import DraggableBlock from '@/components/DraggableBlock'

export default async function CVBuilderPage({
  params
}: {
  params: { userId: string }
}) {
  console.log(params)
  const website = await getWebsite(params.userId)
  return (
    <ClientWrapper>
      <div>
        <h1>{website?.title}</h1>
        <div>
          {website?.blocks.map((block) => (
            <DraggableBlock key={block.id} block={block} onUpdate={addBlock} />
          ))}
        </div>
        {/* Add Block form */}
      </div>
    </ClientWrapper>
  )
}
