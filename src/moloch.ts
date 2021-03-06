import fetch from "cross-fetch";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/molochventures/moloch",
  fetch
});

export const getActiveProposals = async () => {
  const result = await client.query({
    query: gql`
      query GetActiveProposals {
        proposals(
          where: { processed: false }
          orderBy: proposalIndex
          orderDirection: asc
        ) {
          proposalIndex
          startingPeriod
          details
          memberAddress
          applicantAddress
          tokenTribute
          sharesRequested
          yesShares
          noShares
          votingPeriodBegins
          votingPeriodEnds
          gracePeriodEnds
        }
        meta(id: "") {
          currentPeriod
          gracePeriodLength
          votingPeriodLength
          periodDuration
          summoningTime
        }
      }
    `
  });
  return result;
};
