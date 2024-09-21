import { ClientWrapper } from '@/components/ClientWrapper'
import { getWebsiteByPath } from '@/actions/websites'

export default async function CVBuilderPage({
  params
}: {
  params: { slug: string }
}) {
  console.log(params)
  const website = await getWebsiteByPath(params.slug)
  return (
    <ClientWrapper>
      <div>
        <h1>{website?.title}</h1>
        <div></div>
        {/* Add Block form */}
      </div>
    </ClientWrapper>
  )
}
