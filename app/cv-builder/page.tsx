import { ClientWrapper } from '@/components/ClientWrapper'
import { getWebsite } from '@/actions/websites'

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
        <div></div>
        {/* Add Block form */}
      </div>
    </ClientWrapper>
  )
}
