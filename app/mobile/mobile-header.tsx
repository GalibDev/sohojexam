import { MobileIcon } from "./mobile-icons";

export function MobileHeader({ title }: { title?: string }) {
  return <header className="mobile-header">
    {title ? <h1>{title}</h1> : <a className="mobile-brand" href="/" aria-label="SohojExam home"><span className="mobile-book"><i/><i/><i/></span><b>Sohoj<em>Exam</em></b></a>}
    <button className="mobile-notification" aria-label="Notifications"><MobileIcon name="bell"/></button>
  </header>;
}