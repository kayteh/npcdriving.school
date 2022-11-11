import { styled, useStyletron } from "baseui";
import { AppNavBar } from "baseui/app-nav-bar";
import { Button } from "baseui/button";
import { ArrowRight, Search } from "baseui/icon";
import { Input } from "baseui/input";
import { DisplayXSmall, ParagraphSmall } from "baseui/typography";
import React from "react";

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  flexDirection: "column",
});

const Wide = styled("div", {
  width: "1000px",
  maxWidth: "90vw",
  flex: 1,
  textAlign: "center",
});

const Info = styled("span", {
  textDecoration: "dotted underline",
});

export default function App() {
  const [css] = useStyletron();
  const [search, setSearch] = React.useState("");
  const placeholder = React.useMemo(() => {
    const list: string[] = [
      "McDonald's",
      "Burger King",
      "Taco Bell",
      "Walgreens",
      "Walmart",
      "Target",
      "7-11",
      "CVS",
      "Sheetz",
      "QuikTrip",
      "Circle K",
      "Gas Station",
      "Starbucks",
      "Restaurant",
      "Grocery Store",
      "Pharmacy",
      "City Hall",
      "Courthouse",
      "Police Station",
    ];

    return list[Math.floor(Math.random() * list.length)];
  }, []);

  return (
    <>
      <AppNavBar title={"NPC Driving School"} />
      <Centered>
        <Wide>
          <DisplayXSmall marginBottom="scale500" marginTop="scale500">
            Where should I send you?
          </DisplayXSmall>
        </Wide>
        <Wide className={css({ display: "flex" })}>
          <Input
            value={search}
            placeholder={placeholder}
            onChange={(e) => setSearch(e.target.value)}
            endEnhancer={() => <Search />}
          />
          <Button
            $as="a"
            href={`maps://?q=${search || placeholder}`}
            endEnhancer={() => <ArrowRight />}
          >
            Navigate
          </Button>
        </Wide>
        <Wide>
          <ParagraphSmall>
            NPC Driving School will randomly pick a map destination based on
            your search. You'll get a Google Maps or Apple Maps link to follow.
          </ParagraphSmall>
          <ParagraphSmall>
            Destinations will be within{" "}
            <Info title="In other words, it doesn't take roads in account.">
              15 miles (as the crow flies)
            </Info>{" "}
            of your location. It's recommended to turn off highways and tolls.
          </ParagraphSmall>
          <ParagraphSmall>
            Use this app at your own risk. Be safe. Don't drive intoxicated. Be
            aware of your surroundings, and don't drive distracted.
          </ParagraphSmall>
        </Wide>
      </Centered>
    </>
  );
}
