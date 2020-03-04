import { getActiveProposals } from "../moloch";
import { createEmbeddedProposal } from "./helpers";

export const getActiveProposalsCommand = {
  name: "active",
  description: "Get Active Proposals",
  execute: async (message, args) => {
    const res = await getActiveProposals();
    console.log("Active Proposals: ", res.data.proposals);
    res.data.proposals.forEach(proposal => {
      message.channel.send(createEmbeddedProposal(proposal, res.data.meta));
    });
  }
};
