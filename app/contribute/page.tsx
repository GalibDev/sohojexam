import { requireChatGPTUser } from "../chatgpt-auth";
import ContributionForm from "./contribution-form";
export const dynamic="force-dynamic";
export default async function Contribute(){await requireChatGPTUser("/contribute");return <ContributionForm/>}
