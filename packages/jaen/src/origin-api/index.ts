import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sq = makeSnekQuery({ Query, Mutation }, {
    apiURL: "https://bf0xierewj.execute-api.eu-central-1.amazonaws.com/graphql"
});
