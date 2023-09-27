import { getSiteCid } from "./helpers";

describe("getSiteCid", () => {
    const testURL =
        "https://gateway.lighthouse.storage/ipfs/QmUiAfDWpKfaJw3bxJFzKG86kPBdt3NaSMPJp29qtEMPDX/";

    it("should return the CID of the site", () => {
        expect(getSiteCid(testURL)).toBe("QmUiAfDWpKfaJw3bxJFzKG86kPBdt3NaSMPJp29qtEMPDX");

        // Test with a localhost
        expect(getSiteCid("http://localhost:3002/")).toBe(
            "QmcHUSx8285V4ZXwXX75SN5CqhaDkdFaP7RbkU4A4tqjeZ"
        );
    });
});
