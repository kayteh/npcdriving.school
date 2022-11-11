import { styled, useStyletron } from "baseui";
import { Button } from "baseui/button";
import { Alert, ArrowRight, Check, Search } from "baseui/icon";
import { Input } from "baseui/input";
import { DisplayXSmall, ParagraphMedium } from "baseui/typography";
import React from "react";

const LAT_MAX = 0.225;
const LONG_MAX = 0.223;

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
  const [deviceCoords, setDeviceCoords] =
    React.useState<GeolocationCoordinates | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDeviceCoords(position.coords);
        localStorage.setItem("has_authorized", "true");
      });
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem("has_authorized") === "true") {
      getLocation();
    }
  }, []);

  const randomCoords = React.useMemo(() => {
    if (!deviceCoords) {
      return null;
    }

    const latDelta = LAT_MAX * (Math.random() * 2 - 1);
    const longDelta = LONG_MAX * (Math.random() * 2 - 1);
    const latitude = deviceCoords?.latitude + latDelta;
    const longitude = deviceCoords?.longitude + longDelta;
    console.log({
      latDelta,
      longDelta,
      latitude,
      longitude,
      longDiff: Math.abs(longitude - deviceCoords?.longitude),
      latDiff: Math.abs(latitude - deviceCoords?.latitude),
      LAT_MAX,
      LONG_MAX,
    });
    return { latitude, longitude };
  }, [deviceCoords]);

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

  const getURL = React.useCallback(() => {
    const terms = search || placeholder;
    // for iOS, generate a maps:// link
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return `maps://?q=${terms}&near=${randomCoords?.latitude},${randomCoords?.longitude}&sll=${randomCoords?.latitude},${randomCoords?.longitude}&z=13.75`;
    }

    // for desktop, generate a google maps link
    return `https://www.google.com/maps/search/${terms}/@${
      randomCoords?.latitude || ""
    },${randomCoords?.longitude || ""},13.75z`;
  }, [search, placeholder, randomCoords]);

  return (
    <>
      <Centered>
        <Wide>
          <DisplayXSmall marginBottom="scale500" marginTop="scale500">
            Where should I send you?
          </DisplayXSmall>
          <ParagraphMedium>
            NPC Driving School will randomly pick a map destination based on
            your search. You'll get a Google Maps or Apple Maps link to follow.
          </ParagraphMedium>
        </Wide>
        {!!deviceCoords ? (
          <Wide className={css({ display: "flex" })}>
            <Input
              value={search}
              placeholder={placeholder}
              onChange={(e) => setSearch(e.target.value)}
              endEnhancer={() => <Search />}
            />
            <Button $as="a" href={getURL()} endEnhancer={() => <ArrowRight />}>
              Navigate
            </Button>
          </Wide>
        ) : (
          <Wide>
            <ParagraphMedium>
              Please let us get your device's location, it'll make this work
              better.
            </ParagraphMedium>
            <Button endEnhancer={() => <Check />} onClick={() => getLocation()}>
              Authorize Location Data
            </Button>
          </Wide>
        )}
        <Wide>
          <ParagraphMedium>
            Destinations will be within{" "}
            <Info title="In other words, it doesn't take roads in account.">
              15mi/25km (as the crow flies)
            </Info>{" "}
            of your location. It's recommended to turn off highways and tolls.
          </ParagraphMedium>
          <ParagraphMedium>
            Use this app at your own risk. Be safe. Don't drive intoxicated. Be
            aware of your surroundings, and don't drive distracted.
          </ParagraphMedium>
          {React.useMemo(
            () =>
              deviceCoords != null && deviceCoords.accuracy > 25000 ? (
                <ParagraphMedium color="gold">
                  <Alert size="scale700" /> Our accuracy on your location looks
                  extremely incorrect.
                </ParagraphMedium>
              ) : null,
            [deviceCoords]
          )}
          {!!deviceCoords && (
            <ParagraphMedium>
              We think you're at {deviceCoords.latitude},
              {deviceCoords.longitude} (accurate to{" "}
              {Math.round(deviceCoords.accuracy)} meters).
              <br />
              We'll base results around {randomCoords?.latitude},
              {randomCoords?.longitude}.
            </ParagraphMedium>
          )}
        </Wide>
      </Centered>
    </>
  );
}
