import { MobileIcon } from "./mobile-icons";

export function MobileHeader() {
  return <header className="mobile-header">
    <a className="mobile-brand" href="/" aria-label="SohojExam home"><span>S</span><b>Sohoj<em>Exam</em></b></a>
    <button className="mobile-notification" aria-label="Notifications"><MobileIcon name="bell"/><i/></button>
  </header>;
}