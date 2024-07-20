import { KBarPortal, KBarPositioner, KBarAnimator, KBarSearch } from 'kbar'

export const Search = () => {
  return (
    <KBarPortal>
      <div className="fixed left-0 top-0 z-[9999] h-screen w-screen overflow-hidden bg-transparent backdrop-blur-xl"></div>
      <KBarPositioner className="fixed left-0 top-0 z-[9999] h-full w-screen bg-[#0003] dark:bg-[#0f172acc]">
        <KBarAnimator
          disableCloseOnOuterClick={false}
          className="w-full max-w-xl overflow-hidden rounded-2xl"
        >
          <KBarSearch
            className="box-border h-14 w-full flex-1 border-none px-4 py-3 outline-0"
            maxLength={64}
            defaultPlaceholder="Search documentation"
          />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}
