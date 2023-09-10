import { redirect } from "@remix-run/node"

export const loader = () => {
  return redirect('/docs/installation');
}
export default function Index() {
  return (
    <div>
    </div>
  )
}