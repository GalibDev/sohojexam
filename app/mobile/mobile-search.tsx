import { MobileIcon } from "./mobile-icons";

export function MobileSearch() {
  return <form className="mobile-search" action="/questions">
    <MobileIcon name="search"/>
    <input name="q" aria-label="Search question papers" placeholder="Search subjects or question papers"/>
  </form>;
}