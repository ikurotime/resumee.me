import { getUserById, getWebsiteByPath } from '@/actions/websites'

import { CVBuilderClient } from '@/components/CVBuilderClient'

export default async function CVBuilderPage({
  params
}: {
  params: { slug: string }
}) {
  const websiteData = await getWebsiteByPath(params.slug)
  if (!websiteData) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-2xl font-bold mb-4'>Resumee not found</h1>
        <p className='mb-4'>
          The Resumee you&apos;re looking for doesn&apos;t exist.
        </p>
        <a
          href='/signup'
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          Grab this link for me!
        </a>
      </div>
    )
  }
  const userData = await getUserById(websiteData?.user_id)

  return (
    <CVBuilderClient
      initialWebsite={websiteData}
      initialUser={userData?.data}
    />
  )
}
