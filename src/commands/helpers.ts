import { ethers } from "ethers";
import { RichEmbed } from "discord.js";
import moment from "moment";

const RED = "#aa174c";
const GREEN = "#4daa17";

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
  const votingPeriodBegins = moment.unix(proposal.votingPeriodBegins);
  const votingPeriodEnds = moment.unix(proposal.votingPeriodEnds);
  const gracePeriodEnds = moment.unix(proposal.gracePeriodEnds);

  let status: string;
  let ends: string;
  if (moment().isAfter(gracePeriodEnds)) {
    status = ProposalStatus.READY_FOR_PROCESSING;
    ends = " "
  } else if (moment().isAfter(votingPeriodEnds)) {
    status = ProposalStatus.IN_GRACE_PERIOD;
    ends = `Ends in ${moment().to(gracePeriodEnds)}`;
  } else if (moment().isAfter(votingPeriodBegins)) {
    status = ProposalStatus.IN_VOTING_PERIOD;
    ends = `Ends in ${moment().to(votingPeriodEnds)}`;
  } else {
    status = ProposalStatus.IN_QUEUE;
    ends = `Voting begins in ${moment().to(votingPeriodBegins)}`;
  }
  return { status, ends };
};

export const createEmbeddedProposal = (proposal, meta) => {
  const { title, description } = parseProposalTitle(proposal);
  const { status, ends } = getStatus(proposal, meta);
  return new RichEmbed()
    .setColor(parseInt(proposal.yesShares) > parseInt(proposal.noShares) ? GREEN : RED)
    .setTitle(title)
    .setDescription(description)
    .addField("Tribute", ethers.utils.parseEther(proposal.tokenTribute))
    .addField("Shares Requested", proposal.sharesRequested)
    .addField("Proposer", proposal.memberAddress, true)
    .addField("Beneficiary", proposal.applicantAddress, true)
    .addField(status, ends)
    .addField("Votes Yes", proposal.yesShares, true)
    .addField("Votes No", proposal.noShares, true);
};
