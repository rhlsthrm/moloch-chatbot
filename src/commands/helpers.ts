import { ethers } from "ethers";
import { RichEmbed } from "discord.js";

const parseProposalTitle = proposal => {
  let title = "";
  let description = "";
  try {
    const parsed = JSON.parse(proposal.details);
    title = parsed.title;
    description = parsed.description;
  } catch (e) {
    title = "N/A";
    description = proposal.details;
  }
  return { title, description };
};

const ProposalStatus = {
  READY_FOR_PROCESSING: "Ready for Processing",
  IN_GRACE_PERIOD: "In Grace Period",
  IN_VOTING_PERIOD: "In Voting Period",
  IN_QUEUE: "In Queue"
};

const getStatus = (proposal, meta) => {
  proposal.startingPeriod = parseInt(proposal.startingPeriod);
  meta.votingPeriodLength = parseInt(meta.votingPeriodLength);
  meta.gracePeriodLength = parseInt(meta.gracePeriodLength);
  const votingPeriodStarts = proposal.startingPeriod;
  const gracePeriodStarts = proposal.startingPeriod + meta.votingPeriodLength;
  const gracePeriodEnds =
    proposal.startingPeriod + meta.votingPeriodLength + meta.gracePeriodLength;

  let status;
  let ends;
  if (meta.currentPeriod >= gracePeriodEnds) {
    status = ProposalStatus.READY_FOR_PROCESSING;
  } else if (meta.currentPeriod >= gracePeriodStarts) {
    status = ProposalStatus.IN_GRACE_PERIOD;
    ends = gracePeriodEnds - meta.currentPeriod;
  } else if (meta.currentPeriod >= votingPeriodStarts) {
    status = ProposalStatus.IN_VOTING_PERIOD;
    ends = gracePeriodStarts - meta.currentPeriod;
  } else {
    status = ProposalStatus.IN_QUEUE;
    ends = votingPeriodStarts - meta.currentPeriod;
  }
  return { status, ends };
};

export const createEmbeddedProposal = (proposal, meta) => {
  const { title, description } = parseProposalTitle(proposal);
  const { status, ends } = getStatus(proposal, meta);
  return new RichEmbed()
    .setColor("#aa174c")
    .setTitle(title)
    .setDescription(description)
    .addField("Tribute", ethers.utils.parseEther(proposal.tokenTribute))
    .addField("Shares Requested", proposal.sharesRequested)
    .addField("Proposer", proposal.memberAddress, true)
    .addField("Beneficiary", proposal.applicantAddress, true)
    .addField(status, `Ends in ${ends * meta.periodDuration} seconds`)
    .addField("Votes Yes", proposal.yesShares, true)
    .addField("Votes No", proposal.noShares, true);
};
