import React from 'react'
import Portfolio from "./portfolio"
import Nav from "@/app/components/nav"
import Footer from "@/app/components/footer"
import { getPortfolioEntries } from "@/lib/store"

// Uploads from /admin/media should show up straight away.
export const dynamic = "force-dynamic"

const page = async () => {
  const uploaded = (await getPortfolioEntries()).map(({ id, srcs, video, alt, note, category, tall }) => ({
    id, srcs, video, alt, note, category, tall,
  }))

  return (
    <div>
     <div className='mb-16'>
     < Nav />
     </div>
     < Portfolio uploaded={uploaded} />
     < Footer />
    </div>
  )
}

export default page
