import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/profile.html');

class Test extends StageTest {

    page = this.getPage(pagePath)


    tests = [this.node.execute(async () => {
        // test #1
        // set viewport
        await this.page.open()
        await this.page.setViewport({width: 1200, height: 825})

        return correct()
    }), this.page.execute(() => {
        // test #2
        // HELPERS-->
        // method to check if element with id exists
        this.elementExists = (id, nodeNames) => {
            const element = document.body.querySelector(id);
            if (!element) return true;
            else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
        };

        // method to check if one element has less with than the other
        this.elementWidthLessThan = (id1, id2) => {
            const element1 = document.body.querySelector(id1);
            const element2 = document.body.querySelector(id2);
            if (!element1 || !element2) return true;
            const width1 = element1.getBoundingClientRect()["width"];
            const width2 = element2.getBoundingClientRect()["width"];
            // console.log(width1, width2);
            return width1 >= width2;
        };

        // method to check the style of the element with id
        this.elementStyle = (id, style, value) => {
            const element = document.querySelector(id);
            if (!element) return true;
            const styleValue = getComputedStyle(element)[style];
            // console.log(styleValue);
            return styleValue !== value;
        };

        // method to compare two elements position
        this.elementPositionCompareX = (id1, id2) => {
            const element1 = document.body.querySelector(id1);
            const element2 = document.body.querySelector(id2);
            if (!element1 || !element2) return true;
            const top1 = element1.getBoundingClientRect()["top"]; // y
            const left1 = element1.getBoundingClientRect()["left"]; // x
            const top2 = element2.getBoundingClientRect()["top"]; // y
            const left2 = element2.getBoundingClientRect()["left"]; // x
            // console.log("x1:", left1, "y1:", top1, "x2:", left2, "y2:", top2);
            let topDiff = Math.abs(top2 - top1) > 15;
            return topDiff || left1 > left2;
        }

        // <--HELPERS
        // CONSTANTS-->
        const theElement = "The element with the selector of";
        this.bg = "background-color";
        this.radius = "border-radius";
        this.shadow = "box-shadow";
        // <--CONSTANTS
        // MESSAGES-->
        this.missingIdMsg = (id) => {
            return `${theElement} ${id} is missing in the body of the HTML document.`;
        };
        this.wrongTagMsg = (id, tag, tagAlt) => {
            if (tagAlt) return `${theElement} ${id} should be a/an ${tag} or ${tagAlt} tag.`;
            else return `${theElement} ${id} should be a/an ${tag} tag.`;
        };
        this.widthLessThanMsg = (id1, id2) => {
            return `${theElement} ${id1}'s width should be less than the element with the selector of ${id2}.`;
        };
        this.wrongStyleMsg = (id, style) => {
            return `${theElement} ${id}'s ${style} is different from the Figma designs.`;
        };
        this.wrongPositionCompareXMsg = (id1, id2) => {
            return `${theElement} ${id1} should be on the left of ${theElement} ${id2}.`;
        };
        // <--MESSAGES
        return correct();
    }), this.page.execute(() => {
        // test #3
        // STAGE1 TAGS EXIST

        // check if element with id #Navbar exists
        let idNavbar = "#navbar";
        if (this.elementExists(idNavbar)) return wrong(this.missingIdMsg(idNavbar));

        // check the tag of element with id #Navbar
        if (this.elementExists(idNavbar, ["nav", "header"]))
            return wrong(this.wrongTagMsg(idNavbar, "nav", "header"));

        // check if element with id #profile-card exists
        let idProfileCard = "#profile-card";
        if (this.elementExists(idProfileCard)) return wrong(this.missingIdMsg(idProfileCard));

        // check the tag of element with id #profile-card
        if (this.elementExists(idProfileCard, ["aside"]))
            return wrong(this.wrongTagMsg(idProfileCard, "aside"));

        // check if element with id #description exists
        let idDescription = "#description";
        if (this.elementExists(idDescription)) return wrong(this.missingIdMsg(idDescription));

        // check the tag of element with id #description
        if (this.elementExists(idDescription, ["section"]))
            return wrong(this.wrongTagMsg(idDescription, "section"));

        // check if element with id #Footer exists
        let idFooter = "#footer";
        if (this.elementExists(idFooter)) return wrong(this.missingIdMsg(idFooter));

        // check the tag of element with id #Footer
        if (this.elementExists(idFooter, ["footer"]))
            return wrong(this.wrongTagMsg(idFooter, "footer"));

        return correct()

    }),
        this.page.execute(() => {
            // test #4
            // STAGE1 POSITION AND SIZE
            // check if element with id #profile-card have correct position
            let idProfileCard = "#profile-card";
            let idDescription = "#description";

            if (this.elementPositionCompareX(idProfileCard, idDescription))
                return wrong(this.wrongPositionCompareXMsg(idProfileCard, idDescription));

            // check if element with id #profile card has less width than element with id #description
            if (this.elementWidthLessThan(idProfileCard, idDescription))
                return wrong(this.widthLessThanMsg(idProfileCard, idDescription));

            return correct()
        }),
        this.page.execute(() => {
            // test #5
            // STAGE1 CSS PROPERTIES

            // check if element with id #Navbar has correct background color
            let idNavbar = "#navbar";
            let bgColor = "rgb(58, 172, 255)";
            if (this.elementStyle(idNavbar, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idNavbar, this.bg));

            // check if element with id #Footer has correct background color
            let idFooter = "#footer";
            if (this.elementStyle(idFooter, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idFooter, this.bg));

            // check if element with id #profile-card has correct background color
            let idProfileCard = "#profile-card";
            bgColor = "rgb(171, 219, 255)";
            if (this.elementStyle(idProfileCard, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idProfileCard, this.bg));

            // check if element with id #description has correct background color
            let idDescription = "#description";
            bgColor = "rgba(171, 219, 255, 0.5)";
            if (this.elementStyle(idDescription, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idDescription, this.bg));

            // check if element with id #profile-card has correct border-radius
            let correctBorderRadius = "24px";
            if (this.elementStyle(idProfileCard, this.radius, correctBorderRadius))
                return wrong(this.wrongStyleMsg(idProfileCard, this.radius));

            // check if element with id #description has correct border-radius
            if (this.elementStyle(idDescription, this.radius, correctBorderRadius))
                return wrong(this.wrongStyleMsg(idDescription, this.radius));

            // check if element with id #profile-card has correct box-shadow
            let correctBoxShadow = "rgba(0, 0, 0, 0.25) 0px 5px 5px 0px";
            if (this.elementStyle(idProfileCard, this.shadow, correctBoxShadow))
                return wrong(this.wrongStyleMsg(idProfileCard, this.shadow));

            // check if element with id #description has correct box-shadow
            if (this.elementStyle(idDescription, this.shadow, correctBoxShadow))
                return wrong(this.wrongStyleMsg(idDescription, this.shadow));

            return correct()
        })
    ]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);