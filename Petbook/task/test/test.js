import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/profile.html');
const page2Path = path.join(import.meta.url, '../../src/friends.html');

class Test extends StageTest {

    page = this.getPage(pagePath);
    page2 = this.getPage(page2Path);

    tests = [this.node.execute(async () => {
        // test #1
        // set viewport
        await this.page.open()
        await this.page.setViewport({width: 1200, height: 825})

        return correct()
    }),
        this.page.execute(() => {
            // test #2
            // HELPERS-->
            // method to check if element with id exists
            this.elementExists = (id, nodeNames) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
            };

            // method to check if element with id has right parent element
            this.elementHasParent = (id, parentId) => {
                const parent = document.body.querySelector(parentId);
                if (!parent) return true//console.log(parent.id)
                const element = parent.querySelector(id)//console.log(element.id)
                return !element;
            };

            // method to check the position of the element with id
            this.elementPosition = (id, topLow = 0, topHigh = 0, leftLow = 0, leftHigh = 0) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const top = element.getBoundingClientRect()["top"]; // y
                const left = element.getBoundingClientRect()["left"]; // //console.log("x:", left, "y:", top);

                if (top < topLow || top > topHigh) return true;
                else return left < leftLow || left > leftHigh;
            };

            // method to check the exact width of the element with id
            this.exactElementWidth = (id, widthExact = 0) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const width = element.getBoundingClientRect()["width"]//console.log(width);
                return width !== widthExact;
            };

            // method to check if one element has less with than the other
            this.elementWidthLessThan = (id1, id2) => {
                const element1 = document.body.querySelector(id1);
                const element2 = document.body.querySelector(id2);
                if (!element1 || !element2) return true;
                const width1 = element1.getBoundingClientRect()["width"];
                const width2 = element2.getBoundingClientRect()["width"]//console.log(width1, width2);
                return width1 >= width2;
            };

            // method to check the style of the element with id
            this.elementStyle = (id, style, value, strict=true) => {
                const element = document.querySelector(id);
                if (!element) return true;
                const styleValue = getComputedStyle(element)[style];
                if (!strict) return !styleValue.includes(value);
                return styleValue !== value;
            };

            // method to check if element with id has right attribute
            this.elementHasAttribute = (id, attribute, value, strict=true) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const attributeValue = element.getAttribute(attribute);
                if (!attributeValue) return true;
                // console.log(attributeValue);
                if (!strict) return value && !attributeValue.includes(value);
                return value && attributeValue !== value;
            };

            // method to check if element with id has right text
            this.elementHasText = (id, text) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const textValue = element.innerText.trim()//console.log(textValue);
                return textValue !== text;
            };

            // method to compare two elements position
            this.elementPositionCompareX = (id1, id2) => {
                const element1 = document.body.querySelector(id1);
                const element2 = document.body.querySelector(id2);
                if (!element1 || !element2) return true;
                const top1 = element1.getBoundingClientRect()["top"]; // y
                const left1 = element1.getBoundingClientRect()["left"]; // x
                const top2 = element2.getBoundingClientRect()["top"]; // y
                const left2 = element2.getBoundingClientRect()["left"]; // //console.log("x1:", left1, "y1:", top1, "x2:", left2, "y2:", top2);
                let topDiff = Math.abs(top2 - top1) > 15;
                return topDiff || left1 > left2;
            }

            // method to compare two elements position
            this.elementPositionCompareY = (id1, id2) => {
                const element1 = document.body.querySelector(id1);
                const element2 = document.body.querySelector(id2);
                if (!element1 || !element2) return true;
                const top1 = element1.getBoundingClientRect()["top"]; // y
                const left1 = element1.getBoundingClientRect()["left"]; // x
                const top2 = element2.getBoundingClientRect()["top"]; // y
                const left2 = element2.getBoundingClientRect()["left"]; // //console.log("x1:", left1, "y1:", top1, "x2:", left2, "y2:", top2);
                let leftDiff = Math.abs(left2 - left1) > 15;
                return leftDiff || top1 > top2;
            };

            // method to check multiple tags in the same element
            this.multipleChecks = (id, parentId, text, fsize, lineH, color) => {
                // check if element with id #types-animal exist
                if (this.elementExists(id))
                    return this.missingIdMsg(id);

                // check if element with id #types-animal has correct tag
                if (this.elementExists(id, ["p"]))
                    return this.wrongTagMsg(id, "p");

                // check if element with id #types-animal is in #description
                if (this.elementHasParent(id, parentId))
                    return this.wrongParentMsg(id, parentId);

                // check if element with id #types-animal has correct text
                if (this.elementHasText(id, text))
                    return this.wrongTextMsg(id, text);

                // check if element with id #types-animal has correct color
                if (this.elementStyle(id, "color", color))
                    return this.wrongStyleMsg(id, "color");

                return false;
            };

            // <--HELPERS

            // CONSTANTS-->
            const checkFigma = "It should be close to the Figma designs.";
            const theElement = "the element with the selector of";
            const thePage = "In the Profile page,";
            this.bg = "background-color";
            this.radius = "border-radius";
            this.shadow = "box-shadow";
            this.font = "font-family";
            this.lato = "Lato";
            this.fsize = "font-size";
            this.fweight = "font-weight";
            this.line = "line-height";
            this.px24 = "24px";
            this.px29 = "29px";
            this.rgb86 = "rgb(86, 86, 86)";
            this.rgb0 = "rgb(0, 0, 0)";
            // <--CONSTANTS

            // MESSAGES-->
            this.missingIdMsg = (id) => {
                return `${thePage} ${theElement} ${id} is missing in the body of the HTML document.`;
            };
            this.wrongTagMsg = (id, tag, tagAlt) => {
                if (tagAlt) return `${thePage} ${theElement} ${id} should be a/an ${tag} or ${tagAlt} tag.`;
                else return `${thePage} ${theElement} ${id} should be a/an ${tag} tag.`;
            };
            this.topBottomMsg = (id, pos) => {
                return `${thePage} ${theElement} ${id} should be at the ${pos} of the page.`;
            };
            this.wrongWidthMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s width seems a bit out of proportion. ${checkFigma}`;
            };
            this.wrongPositionMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s position seems a bit off. ${checkFigma}`;
            };
            this.widthLessThanMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1}'s width should be less than ${theElement} ${id2}.`;
            };
            this.wrongStyleMsg = (id, style) => {
                return `${thePage} ${theElement} ${id}'s ${style} is different from the Figma designs.`;
            };
            this.wrongParentMsg = (id, parentId) => {
                return `${thePage} ${theElement} ${id} should be a child of ${theElement} ${parentId}.`;
            };
            this.wrongAttributeMsg = (id, attribute, value) => {
                if (value) return `${thePage} ${theElement} ${id} should have the attribute "${attribute}" with the value of "${value}".`;
                return `${thePage} ${theElement} ${id} should have the attribute "${attribute}".`;
            };
            this.wrongTextMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s text is different from the Figma designs.`;
            };
            this.wrongPositionCompareXMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1} should be on the left of ${theElement} ${id2}.`;
            };
            this.wrongPositionCompareYMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1} should be above ${theElement} ${id2}.`;
            };
            this.missingOptionMsg = (id) => {
                return `${thePage} ${theElement} ${id} should have at least one option.`;
            };
            // <--MESSAGES
            return correct();

        }),
        this.page.execute(() => {
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
        }),
        this.page.execute(() => {
            // test #6
            // STAGE2 Navbar Elements
            const idNavbar = "#navbar";
            const idPetProfileLink = "#pet-profile-link";
            const idFriendsLink = "#friends-link";
            const idSettingsLink = "#settings-link";

            // #logo
            // check if element with id #logo exist
            let idLogo = "#logo";
            if (this.elementExists(idLogo)) return wrong(this.missingIdMsg(idLogo));

            // check if element with id #logo has correct tag
            if (this.elementExists(idLogo, ["img"]))
                return wrong(this.wrongTagMsg(idLogo, "img"));

            // check if element with id #logo is in #navbar
            if (this.elementHasParent(idLogo, idNavbar))
                return wrong(this.wrongParentMsg(idLogo, idNavbar));

            // check if element with id #logo has correct src
            let correctSrc = "assets/navbar/logo.png";
            if (this.elementHasAttribute(idLogo, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idLogo, "src", correctSrc));

            // check if element with id #logo has alt
            if (this.elementHasAttribute(idLogo, "alt"))
                return wrong(this.wrongAttributeMsg(idLogo, "alt"));

            // #pet-profile
            // check if element with id #pet-profile exist
            let idPetProfile = "#pet-profile";
            if (this.elementExists(idPetProfile))
                return wrong(this.missingIdMsg(idPetProfile));

            // check if element with id #pet-profile has correct tag
            if (this.elementExists(idPetProfile, ["img"]))
                return wrong(this.wrongTagMsg(idPetProfile, "img"));

            // check if element with id #pet-profile is in #pet-profile-link
            if (this.elementHasParent(idPetProfile, idPetProfileLink))
                return wrong(this.wrongParentMsg(idPetProfile, idPetProfileLink));

            // check if element with id #pet-profile has correct src
            correctSrc = "assets/navbar/pet-profile.png";
            if (this.elementHasAttribute(idPetProfile, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idPetProfile, "src", correctSrc));

            // check if element with id #pet-profile has alt
            if (this.elementHasAttribute(idPetProfile, "alt"))
                return wrong(this.wrongAttributeMsg(idPetProfile, "alt"));

            // #friends
            // check if element with id #friends exist
            let idFriends = "#friends";
            if (this.elementExists(idFriends))
                return wrong(this.missingIdMsg(idFriends));

            // check if element with id #friends has correct tag
            if (this.elementExists(idFriends, ["img"]))
                return wrong(this.wrongTagMsg(idFriends, "img"));

            // check if element with id #friends is in #friends-link
            if (this.elementHasParent(idFriends, idFriendsLink))
                return wrong(this.wrongParentMsg(idFriends, idFriendsLink));

            // check if element with id #friends has correct src
            correctSrc = "assets/navbar/friends.png";
            if (this.elementHasAttribute(idFriends, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idFriends, "src", correctSrc));

            // check if element with id #friends has alt
            if (this.elementHasAttribute(idFriends, "alt"))
                return wrong(this.wrongAttributeMsg(idFriends, "alt"));

            // #settings
            // check if element with id #settings exist
            let idSettings = "#settings";
            if (this.elementExists(idSettings))
                return wrong(this.missingIdMsg(idSettings));

            // check if element with id #settings has correct tag
            if (this.elementExists(idSettings, ["img"]))
                return wrong(this.wrongTagMsg(idSettings, "img"));

            // check if element with id #settings is in #settings-link
            if (this.elementHasParent(idSettings, idSettingsLink))
                return wrong(this.wrongParentMsg(idSettings, idSettingsLink));

            // check if element with id #settings has correct src
            correctSrc = "assets/navbar/settings.png";
            if (this.elementHasAttribute(idSettings, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idSettings, "src", correctSrc));

            // check if element with id #settings has alt
            if (this.elementHasAttribute(idSettings, "alt"))
                return wrong(this.wrongAttributeMsg(idSettings, "alt"));

            // #pet-profile-link
            // check if element with id #pet-profile-link exist
            if (this.elementExists(idPetProfileLink))
                return wrong(this.missingIdMsg(idPetProfileLink));

            // check if element with id #pet-profile-link has correct tag
            if (this.elementExists(idPetProfileLink, ["a"]))
                return wrong(this.wrongTagMsg(idPetProfileLink, "a"));

            // check if element with id #pet-profile-link is in #navbar
            if (this.elementHasParent(idPetProfileLink, idNavbar))
                return wrong(this.wrongParentMsg(idPetProfileLink, idNavbar));

            // check if element with id #pet-profile-link has correct href
            let correctHref = "profile.html";
            if (this.elementHasAttribute(idPetProfileLink, "href", correctHref, false))
                return wrong(this.wrongAttributeMsg(idPetProfileLink, "href", correctHref));

            // check if element with id #pet-profile-link has correct text-decoration
            if (this.elementStyle(idPetProfileLink, "text-decoration-line", "none"))
                return wrong(this.wrongStyleMsg(idPetProfileLink, "text-decoration", "none"));

            // check if element with id #pet-profile-link is on the left of #friends-link
            if (this.elementPositionCompareX(idPetProfileLink, idFriendsLink))
                return wrong(this.wrongPositionCompareXMsg(idPetProfileLink, idFriendsLink));

            // #friends-link
            // check if element with id #friends-link exist
            if (this.elementExists(idFriendsLink))
                return wrong(this.missingIdMsg(idFriendsLink));

            // check if element with id #friends-link has correct tag
            if (this.elementExists(idFriendsLink, ["a"]))
                return wrong(this.wrongTagMsg(idFriendsLink, "a"));

            // check if element with id #friends-link is in #navbar
            if (this.elementHasParent(idFriendsLink, idNavbar))
                return wrong(this.wrongParentMsg(idFriendsLink, idNavbar));

            // check if element with id #friends-link is on the left of #settings-link
            if (this.elementPositionCompareX(idFriendsLink, idSettingsLink))
                return wrong(this.wrongPositionCompareXMsg(idFriendsLink, idSettingsLink));

            // #settings-link
            // check if element with id #settings-link exist
            if (this.elementExists(idSettingsLink))
                return wrong(this.missingIdMsg(idSettingsLink));

            // check if element with id #settings-link has correct tag
            if (this.elementExists(idSettingsLink, ["a"]))
                return wrong(this.wrongTagMsg(idSettingsLink, "a"));

            // check if element with id #settings-link is in #navbar
            if (this.elementHasParent(idSettingsLink, idNavbar))
                return wrong(this.wrongParentMsg(idSettingsLink, idNavbar));

            return correct()
        }),
        this.page.execute(() => {
            // test #7
            // STAGE2 Footer Elements
            const idFooter = "#footer";

            // #footer-text
            // check if element with id #footer-text exist
            let idFooterText = "#footer-text";
            if (this.elementExists(idFooterText))
                return wrong(this.missingIdMsg(idFooterText));

            // check if element with id #footer-text has correct tag
            if (this.elementExists(idFooterText, ["p", "span"]))
                return wrong(this.wrongTagMsg(idFooterText, "span", "p"));

            // check if element with id #footer-text is in #footer
            if (this.elementHasParent(idFooterText, idFooter))
                return wrong(this.wrongParentMsg(idFooterText, idFooter));

            // check if element with id #footer-text has correct text
            let correctText = "© Petbook | All Rights Reserved";
            if (this.elementHasText(idFooterText, correctText))
                return wrong(this.wrongTextMsg(idFooterText, correctText));

            // check if element with id #footer-text has correct color
            if (this.elementStyle(idFooterText, "color", "rgb(255, 255, 255)"))
                return wrong(this.wrongStyleMsg(idFooterText, "color"));

            // #facebook
            // check if element with id #facebook exist
            let idFacebook = "#facebook";
            if (this.elementExists(idFacebook))
                return wrong(this.missingIdMsg(idFacebook));

            // check if element with id #facebook has correct tag
            if (this.elementExists(idFacebook, ["svg"]))
                return wrong(this.wrongTagMsg(idFacebook, "svg"));

            // check if element with id #facebook is in #footer
            if (this.elementHasParent(idFacebook, idFooter))
                return wrong(this.wrongParentMsg(idFacebook, idFooter));

            // #twitter
            // check if element with id #twitter exist
            let idTwitter = "#twitter";
            if (this.elementExists(idTwitter))
                return wrong(this.missingIdMsg(idTwitter));

            // check if element with id #twitter has correct tag
            if (this.elementExists(idTwitter, ["svg"]))
                return wrong(this.wrongTagMsg(idTwitter, "svg"));

            // check if element with id #twitter is in #footer
            if (this.elementHasParent(idTwitter, idFooter))
                return wrong(this.wrongParentMsg(idTwitter, idFooter));

            // check if element with id #facebook is on left of #twitter
            if (this.elementPositionCompareX(idFacebook, idTwitter))
                return wrong(this.wrongPositionCompareXMsg(idFacebook, idTwitter));

            // #instagram
            // check if element with id #instagram exist
            let idInstagram = "#instagram";
            if (this.elementExists(idInstagram))
                return wrong(this.missingIdMsg(idInstagram));

            // check if element with id #instagram has correct tag
            if (this.elementExists(idInstagram, ["svg"]))
                return wrong(this.wrongTagMsg(idInstagram, "svg"));

            // check if element with id #instagram is in #footer
            if (this.elementHasParent(idInstagram, idFooter))
                return wrong(this.wrongParentMsg(idInstagram, idFooter));

            // check if element with id #twitter is on left of #instagram
            if (this.elementPositionCompareX(idTwitter, idInstagram))
                return wrong(this.wrongPositionCompareXMsg(idTwitter, idInstagram));

            return correct();
        }),
        this.page.execute(() => {
            // test #8
            // STAGE2 Profile Aside
            const idProfileCard = "#profile-card";

            // #profile-image
            // check if element with id #profile-image exist
            let idProfileImage = "#profile-image";
            if (this.elementExists(idProfileImage))
                return wrong(this.missingIdMsg(idProfileImage));

            // check if element with id #profile-image has correct tag
            if (this.elementExists(idProfileImage, ["img"]))
                return wrong(this.wrongTagMsg(idProfileImage, "img"));

            // check if element with id #profile-image is in #ProfileAside
            if (this.elementHasParent(idProfileImage, idProfileCard))
                return wrong(this.wrongParentMsg(idProfileImage, idProfileCard));

            // check if element with id #profile-image has correct src
            let correctSrc = "assets/profile/profile-image.png";
            if (this.elementHasAttribute(idProfileImage, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idProfileImage, "src", correctSrc));

            // check if element with id #profile-image has alt
            if (this.elementHasAttribute(idProfileImage, "alt"))
                return wrong(this.wrongAttributeMsg(idProfileImage, "alt"));

            // check if element with id #profile-image has correct border
            let correctBorder = "5px solid rgb(199, 199, 199)";
            if (this.elementStyle(idProfileImage, "border", correctBorder))
                return wrong(this.wrongStyleMsg(idProfileImage, "border"));

            // check if element with id #profile-image has correct border-radius
            let correctBorderRadius = "150px";
            if (this.elementStyle(idProfileImage, this.radius, correctBorderRadius))
                return wrong(this.wrongStyleMsg(idProfileImage, this.radius));

            // #profile-name
            // check if element with id #profile-name exist
            let idProfileName = "#profile-name";
            if (this.elementExists(idProfileName))
                return wrong(this.missingIdMsg(idProfileName));

            // check if element with id #profile-name has correct tag
            if (this.elementExists(idProfileName, ["span", "p"]))
                return wrong(this.wrongTagMsg(idProfileName, "span", "p"));

            // check if element with id #profile-name is in #profile-card
            if (this.elementHasParent(idProfileName, idProfileCard))
                return wrong(this.wrongParentMsg(idProfileName, idProfileCard));

            // check if element with id #profile-name has correct text
            let correctText = "Kabosu";
            if (this.elementHasText(idProfileName, correctText))
                return wrong(this.wrongTextMsg(idProfileName, correctText));

            // check if element with id #profile-name has correct color
            let correctColor = "rgb(0, 0, 0)";
            if (this.elementStyle(idProfileName, "color", correctColor))
                return wrong(this.wrongStyleMsg(idProfileName, "color"));

            // #profile-flag
            // check if element with id #profile-flag exist
            let idProfileFlag = "#profile-flag";
            if (this.elementExists(idProfileFlag))
                return wrong(this.missingIdMsg(idProfileFlag));

            // check if element with id #profile-flag has correct tag
            if (this.elementExists(idProfileFlag, ["img"]))
                return wrong(this.wrongTagMsg(idProfileFlag, "img"));

            // check if element with id #profile-flag is in #profile-card
            if (this.elementHasParent(idProfileFlag, idProfileCard))
                return wrong(this.wrongParentMsg(idProfileFlag, idProfileCard));

            // check if element with id #profile-flag has correct src
            correctSrc = "assets/profile/flag.png";
            if (this.elementHasAttribute(idProfileFlag, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idProfileFlag, "src", correctSrc));

            // check if element with id #profile-flag has alt attribute
            if (this.elementHasAttribute(idProfileFlag, "alt"))
                return wrong(this.wrongAttributeMsg(idProfileFlag, "alt"));

            // check if element with id #profile-name is on the left of #profile-flag
            if (this.elementPositionCompareX(idProfileName, idProfileFlag))
                return wrong(this.wrongPositionCompareXMsg(idProfileName, idProfileFlag));

            // #profile-breed
            // check if element with id #profile-breed exist
            let idProfileBreed = "#profile-breed";
            if (this.elementExists(idProfileBreed))
                return wrong(this.missingIdMsg(idProfileBreed));

            // check if element with id #profile-breed has correct tag
            if (this.elementExists(idProfileBreed, ["span", "p"]))
                return wrong(this.wrongTagMsg(idProfileBreed, "span", "p"));

            // check if element with id #profile-breed is in #profile-card
            if (this.elementHasParent(idProfileBreed, idProfileCard))
                return wrong(this.wrongParentMsg(idProfileBreed, idProfileCard));

            // check if element with id #profile-breed has correct text
            correctText = "Shiba Inu";
            if (this.elementHasText(idProfileBreed, correctText))
                return wrong(this.wrongTextMsg(idProfileBreed, correctText));

            // check if element with id #profile-breed has correct color
            correctColor = "rgb(86, 86, 86)";
            if (this.elementStyle(idProfileBreed, "color", correctColor))
                return wrong(this.wrongStyleMsg(idProfileBreed, "color"));

            // check if element with id #profile-name is on the top of #profile-breed
            if (this.elementPositionCompareY(idProfileName, idProfileBreed))
                return wrong(this.wrongPositionCompareYMsg(idProfileName, idProfileBreed));

            // #profile-country
            // check if element with id #profile-country exist
            let idProfileCountry = "#profile-country";
            if (this.elementExists(idProfileCountry))
                return wrong(this.missingIdMsg(idProfileCountry));

            // check if element with id #profile-country has correct tag
            if (this.elementExists(idProfileCountry, ["span", "p"]))
                return wrong(this.wrongTagMsg(idProfileCountry, "span", "p"));

            // check if element with id #profile-country is in #profile-card
            if (this.elementHasParent(idProfileCountry, idProfileCard))
                return wrong(this.wrongParentMsg(idProfileCountry, idProfileCard));

            // check if element with id #profile-country has correct text
            correctText = "Japan";
            if (this.elementHasText(idProfileCountry, correctText))
                return wrong(this.wrongTextMsg(idProfileCountry));

            // check if element with id #profile-country has correct color
            if (this.elementStyle(idProfileCountry, "color", correctColor))
                return wrong(this.wrongStyleMsg(idProfileCountry, "color"));

            // check if element with id #profile-breed is on the left of #profile-country
            if (this.elementPositionCompareX(idProfileBreed, idProfileCountry))
                return wrong(this.wrongPositionCompareXMsg(idProfileBreed, idProfileCountry));

            // check if element with id #profile-flag is on the top of #profile-country
            if (this.elementPositionCompareY(idProfileFlag, idProfileCountry))
                return wrong(this.wrongPositionCompareYMsg(idProfileFlag, idProfileCountry));

            return correct();

        }),
        this.page.execute(() => {
            // test #9
            // STAGE2 SECTION - DESCRIPTION
            const idDescription = "#description";

            // #description-header
            // check if element with id #description-header exist
            let idDescriptionHeader = "#description-header";
            if (this.elementExists(idDescriptionHeader))
                return wrong(this.missingIdMsg(idDescriptionHeader));

            // check if element with id #description-header has correct tag
            if (this.elementExists(idDescriptionHeader, ["h1", "h2"]))
                return wrong(this.wrongTagMsg(idDescriptionHeader, "h1", "h2"));

            // check if element with id #description-header is in #description
            if (this.elementHasParent(idDescriptionHeader, idDescription))
                return wrong(this.wrongParentMsg(idDescriptionHeader, idDescription));

            // check if element with id #description-header has correct text
            let correctText = "Profile";
            if (this.elementHasText(idDescriptionHeader, correctText))
                return wrong(this.wrongTextMsg(idDescriptionHeader, correctText));

            // check if element with id #description-header has correct color
            let correctColor = "rgb(58, 172, 255)";
            if (this.elementStyle(idDescriptionHeader, "color", correctColor))
                return wrong(this.wrongStyleMsg(idDescriptionHeader, "color"));

            // #types-name
            let idTypesName = "#types-name";

            if (this.multipleChecks(idTypesName, idDescription, "Name", this.px24, this.px29, this.rgb86))
                return wrong(this.multipleChecks(idTypesName, idDescription, "Name", this.px24, this.px29, this.rgb86));

            // check if element with id #description-header is on top of #types-name
            if (this.elementPositionCompareY(idDescriptionHeader, idTypesName))
                return wrong(this.wrongPositionCompareYMsg(idDescriptionHeader, idTypesName));

            // #types-animal
            let idTypesAnimal = "#types-animal";
            if (this.multipleChecks(idTypesAnimal, idDescription, "Animal", this.px24, this.px29, this.rgb86))
                return wrong(this.multipleChecks(idTypesAnimal, idDescription, "Animal", this.px24, this.px29, this.rgb86));

            // check if element with id #types-name is on top of #types-animal
            if (this.elementPositionCompareY(idTypesName, idTypesAnimal))
                return wrong(this.wrongPositionCompareYMsg(idTypesName, idTypesAnimal));

            // #types-breed
            let idTypesBreed = "#types-breed";
            if (this.multipleChecks(idTypesBreed, idDescription, "Breed", this.px24, this.px29, this.rgb86))
                return wrong(this.multipleChecks(idTypesBreed, idDescription, "Breed", this.px24, this.px29, this.rgb86));

            // check if element with id #types-animal is on top of #types-breed
            if (this.elementPositionCompareY(idTypesAnimal, idTypesBreed))
                return wrong(this.wrongPositionCompareYMsg(idTypesAnimal, idTypesBreed));

            // #descriptions-name
            let idDescriptionsName = "#descriptions-name";
            if (this.multipleChecks(idDescriptionsName, idDescription, "Kabosu", this.px24, this.px29, this.rgb0))
                return wrong(this.multipleChecks(idDescriptionsName, idDescription, "Kabosu", this.px24, this.px29, this.rgb0));

            // #descriptions-animal
            let idDescriptionsAnimal = "#descriptions-animal";
            if (this.multipleChecks(idDescriptionsAnimal, idDescription, "Dog", this.px24, this.px29, this.rgb0))
                return wrong(this.multipleChecks(idDescriptionsAnimal, idDescription, "Dog", this.px24, this.px29, this.rgb0));

            // check if element with id #descriptions-name is on top of #descriptions-animal
            if (this.elementPositionCompareY(idDescriptionsName, idDescriptionsAnimal))
                return wrong(this.wrongPositionCompareYMsg(idDescriptionsName, idDescriptionsAnimal));

            // #descriptions-breed
            let idDescriptionsBreed = "#descriptions-breed";
            if (this.multipleChecks(idDescriptionsBreed, idDescription, "Shiba Inu", this.px24, this.px29, this.rgb0))
                return wrong(this.multipleChecks(idDescriptionsBreed, idDescription, "Shiba Inu", this.px24, this.px29, this.rgb0));

            // check if element with id #descriptions-animal is on top of #descriptions-breed
            if (this.elementPositionCompareY(idDescriptionsAnimal, idDescriptionsBreed))
                return wrong(this.wrongPositionCompareYMsg(idDescriptionsAnimal, idDescriptionsBreed));

            // check if element with id #types-name is on the left of #descriptions-name
            if (this.elementPositionCompareX(idTypesName, idDescriptionsName))
                return wrong(this.wrongPositionCompareXMsg(idTypesName, idDescriptionsName));

            // check if element with id #types-animal is on the left of #descriptions-animal
            if (this.elementPositionCompareX(idTypesAnimal, idDescriptionsAnimal))
                return wrong(this.wrongPositionCompareXMsg(idTypesAnimal, idDescriptionsAnimal));

            // check if element with id #types-breed is on the left of #descriptions-breed
            if (this.elementPositionCompareX(idTypesBreed, idDescriptionsBreed))
                return wrong(this.wrongPositionCompareXMsg(idTypesBreed, idDescriptionsBreed));

            return correct()

        }),
        this.page2.execute(() => {
            // test #10
            // HELPERS-->
            // method to check if element with id exists
            this.elementExists = (id, nodeNames) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
            };

            // method to check if element with id has right parent element
            this.elementHasParent = (id, parentId) => {
                const parent = document.body.querySelector(parentId);
                if (!parent) return true;
                // console.log(parent.id)
                const element = parent.querySelector(id);
                // console.log(element?.id)
                return !element;
            };

            // method to check the position of the element with id
            this.elementPosition = (id, topLow = 0, topHigh = 0, leftLow = 0, leftHigh = 0) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const top = element.getBoundingClientRect()["top"]; // y
                const left = element.getBoundingClientRect()["left"]; // x
                // console.log("x:", left, "y:", top);

                if (top < topLow || top > topHigh) return true;
                else return left < leftLow || left > leftHigh;
            };

            // method to check the exact width of the element with id
            this.exactElementWidth = (id, widthExact = 0) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const width = element.getBoundingClientRect()["width"];
                // console.log(width);
                return width !== widthExact;
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
            this.elementStyle = (id, style, value, strict=true) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const styleValue = getComputedStyle(element)[style];
                if (!strict) return !styleValue.includes(value);
                return styleValue !== value;
            };

            // method to check if element with id has right attribute
            this.elementHasAttribute = (id, attribute, value, strict=true) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const attributeValue = element.getAttribute(attribute);
                if (!attributeValue) return true;
                // console.log(attributeValue);
                if (!strict) return value && !attributeValue.includes(value);
                return value && attributeValue !== value;
            };

            // method to check if element with id has right text
            this.elementHasText = (id, text) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const textValue = element.innerText.trim();
                // console.log(textValue);
                return textValue !== text;
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

            // method to compare two elements position
            this.elementPositionCompareY = (id1, id2) => {
                const element1 = document.body.querySelector(id1);
                const element2 = document.body.querySelector(id2);
                if (!element1 || !element2) return true;
                const top1 = element1.getBoundingClientRect()["top"]; // y
                const left1 = element1.getBoundingClientRect()["left"]; // x
                const top2 = element2.getBoundingClientRect()["top"]; // y
                const left2 = element2.getBoundingClientRect()["left"]; // x
                // console.log("x1:", left1, "y1:", top1, "x2:", left2, "y2:", top2);
                let leftDiff = Math.abs(left2 - left1) > 15;
                return leftDiff || top1 > top2;
            };

            // method to check multiple tags in the same element
            this.multipleChecks = (id, parentId, text, fsize, lineH, color, tags) => {
                // check if element with id #types-animal exist
                if (this.elementExists(id))
                    return this.missingIdMsg(id);

                // check if element with id #types-animal has correct tag
                if (this.elementExists(id, tags))
                    return this.wrongTagMsg(id, tags[0], tags[1] || null);

                // check if element with id #types-animal is in #description
                if (this.elementHasParent(id, parentId))
                    return this.wrongParentMsg(id, parentId);

                // check if element with id #types-animal has correct text
                if (this.elementHasText(id, text))
                    return this.wrongTextMsg(id, text);

                // check if element with id #types-animal has correct color
                if (this.elementStyle(id, "color", color))
                    return this.wrongStyleMsg(id, "color");

                return false;
            };

            // method to check multiple things in the select element
            this.selectMultipleChecks = (id, parentId) => {
                // check if element with id exist
                if (this.elementExists(id))
                    return this.missingIdMsg(id);

                // check if element with id has correct parent
                if (this.elementHasParent(id, parentId))
                    return this.wrongParentMsg(id, parentId);

                // check if element with id has correct tag
                if (this.elementExists(id, ["select"]))
                    return this.wrongTagMsg(id, ["select"]);

                // check if element with id has correct bg
                if (this.elementStyle(id, this.bg, this.rgb255))
                    return this.wrongStyleMsg(id, this.bg);

                // check if element with id has correct border
                let correctBorder = "1px solid rgb(223, 223, 223)";
                if (this.elementStyle(id, "border", correctBorder))
                    return this.wrongStyleMsg(id, "border");

                // check if element with id has correct border-radius
                if (this.elementStyle(id, this.radius, "30px"))
                    return this.wrongStyleMsg(id, this.radius);

                // check if element with id has correct color
                if (this.elementStyle(id, "color", this.rgb58))
                    return this.wrongStyleMsg(id, "color");

                // check if element with id has correct padding
                if (this.elementStyle(id, "padding", "8px"))
                    return this.wrongStyleMsg(id, "padding");

                return false;
            };

            // method to check multiple things in the friend-card element
            this.friendCardMultipleChecks = (id, parentId, bgColor, pImage, pName, pFlag, pBreed, pCountry, flagWidth = 25) => {
                // check if element with id exist
                if (this.elementExists(id))
                    return this.missingIdMsg(id);

                // check if element with id has correct parent
                if (this.elementHasParent(id, parentId))
                    return this.wrongParentMsg(id, parentId);

                // check if element with id has correct tag
                if (this.elementExists(id, ["div"]))
                    return this.wrongTagMsg(id, ["div"]);

                // check if element with id has correct bg
                if (this.elementStyle(id, this.bg, bgColor))
                    return this.wrongStyleMsg(id, this.bg);

                // check if element with id has correct border-radius
                if (this.elementStyle(id, this.radius, this.px24))
                    return this.wrongStyleMsg(id, this.radius);

                // check if element with id has correct box-shadow
                if (this.elementStyle(id, this.shadow, "rgba(0, 0, 0, 0.25) 0px 5px 5px 0px"))
                    return this.wrongStyleMsg(id, this.shadow);

                // check if element with class .profile-image exist
                let classProfileImage = id + " .profile-image";
                if (this.elementHasParent(classProfileImage, id))
                    return this.wrongParentMsg(classProfileImage, id);

                // check if element with class .profile-image has correct tag
                if (this.elementExists(classProfileImage, ["img"]))
                    return this.wrongTagMsg(classProfileImage, ["img"]);

                // check if element with class .profile-image has correct src
                if (this.elementHasAttribute(classProfileImage, "src", pImage))
                    return this.wrongAttributeMsg(classProfileImage, "src", pImage);

                // check if element with class .profile-image has alt
                if (this.elementHasAttribute(classProfileImage, "alt"))
                    return this.wrongAttributeMsg(classProfileImage, "alt");

                // check if element with class .profile-image has correct border
                let correctBorder = "2px solid rgb(199, 199, 199)";
                if (this.elementStyle(classProfileImage, "border", correctBorder))
                    return this.wrongStyleMsg(classProfileImage, "border");

                // check if element with class .profile-image has correct border-radius
                let correctBorderRadius = "150px";
                if (this.elementStyle(classProfileImage, this.radius, correctBorderRadius))
                    return this.wrongStyleMsg(classProfileImage, this.radius);

                // check if element with class .profile-name exist
                let classProfileName = id + " .profile-name";
                if (this.elementHasParent(classProfileName, id))
                    return this.wrongParentMsg(classProfileName, id);

                // check if element with class .profile-name has correct tag
                if (this.elementExists(classProfileName, ["span", "p"]))
                    return this.wrongTagMsg(classProfileName, "span", "p");

                // check if element with class .profile-name has correct text
                if (this.elementHasText(classProfileName, pName))
                    return this.wrongTextMsg(classProfileName, pName);

                // check if element with class .profile-name has correct color
                if (this.elementStyle(classProfileName, "color", this.rgb0))
                    return this.wrongStyleMsg(classProfileName, "color");

                // check if element with class .profile-flag exist
                let classProfileFlag = id + " .profile-flag";
                if (this.elementHasParent(classProfileFlag, id))
                    return this.wrongParentMsg(classProfileFlag, id);

                // check if element with class .profile-flag has correct tag
                if (this.elementExists(classProfileFlag, ["img"]))
                    return this.wrongTagMsg(classProfileFlag, ["img"]);

                // check if element with class .profile-flag has correct src
                if (this.elementHasAttribute(classProfileFlag, "src", pFlag))
                    return this.wrongAttributeMsg(classProfileFlag, "src", pFlag);

                // check if element with class .profile-flag has alt
                if (this.elementHasAttribute(classProfileFlag, "alt"))
                    return this.wrongAttributeMsg(classProfileFlag, "alt");

                // check if element with class .profile-name is on the left of the element with class .profile-flag
                if (this.elementPositionCompareX(classProfileName, classProfileFlag))
                    return this.wrongPositionCompareXMsg(classProfileName, classProfileFlag);

                // check if element with class .profile-breed exist
                let classProfileBreed = id + " .profile-breed";
                if (this.elementHasParent(classProfileBreed, id))
                    return this.wrongParentMsg(classProfileBreed, id);

                // check if element with class .profile-breed has correct tag
                if (this.elementExists(classProfileBreed, ["span", "p"]))
                    return this.wrongTagMsg(classProfileBreed, "span", "p");

                // check if element with class .profile-breed has correct text
                if (this.elementHasText(classProfileBreed, pBreed))
                    return this.wrongTextMsg(classProfileBreed, pBreed);

                // check if element with class .profile-breed has correct color
                if (this.elementStyle(classProfileBreed, "color", this.rgb86))
                    return this.wrongStyleMsg(classProfileBreed, "color");

                // check if element with class .profile-name is on the top of the element with class .profile-breed
                if (this.elementPositionCompareY(classProfileName, classProfileBreed))
                    return this.wrongPositionCompareYMsg(classProfileName, classProfileBreed);

                // check if element with class .profile-country exist
                let classProfileCountry = id + " .profile-country";
                if (this.elementHasParent(classProfileCountry, id))
                    return this.wrongParentMsg(classProfileCountry, id);

                // check if element with class .profile-country has correct tag
                if (this.elementExists(classProfileCountry, ["span", "p"]))
                    return this.wrongTagMsg(classProfileCountry, "span", "p");

                // check if element with class .profile-country has correct text
                if (this.elementHasText(classProfileCountry, pCountry))
                    return this.wrongTextMsg(classProfileCountry, pCountry);

                // check if element with class .profile-country has correct color
                if (this.elementStyle(classProfileCountry, "color", this.rgb86))
                    return this.wrongStyleMsg(classProfileCountry, "color");

                // check if element with class .profile-flag is on the top of the element with class .profile-country
                if (this.elementPositionCompareY(classProfileFlag, classProfileCountry))
                    return this.wrongPositionCompareYMsg(classProfileFlag, classProfileCountry);

                // check if element with class .profile-country is on the right of the element with class .profile-breed
                if (this.elementPositionCompareX(classProfileBreed, classProfileCountry))
                    return this.wrongPositionCompareXMsg(classProfileBreed, classProfileCountry);

                return false;
            };

            // <--HELPERS

            // CONSTANTS-->
            const checkFigma = "It should be close to the Figma designs.";
            const theElement = "the element with the selector of";
            const thePage = "In the Friends page,";
            this.bg = "background-color";
            this.radius = "border-radius";
            this.shadow = "box-shadow";
            this.font = "font-family";
            this.lato = "Lato";
            this.fsize = "font-size";
            this.fweight = "font-weight";
            this.line = "line-height";
            this.px24 = "24px";
            this.px29 = "29px";
            this.px16 = "16px";
            this.px10 = "10px";
            this.rgb86 = "rgb(86, 86, 86)";
            this.rgb0 = "rgb(0, 0, 0)";
            this.rgb255 = "rgb(255, 255, 255)";
            this.rgb58 = "rgb(58, 172, 255)";
            this.micky = {
                bg: "rgb(255, 247, 171)",
                img: "assets/friends/profile-image-micky.png",
                name: "Micky", breed: "Cavalier King", country: "UK",
                flag: "assets/friends/uk.png"
            };
            this.browny = {
                bg: "rgb(178, 255, 171)",
                img: "assets/friends/profile-image-browny.png",
                name: "Browny", breed: "Maine Coon", country: "USA",
                flag: "assets/friends/us.png"
            };
            this.louis = {
                bg: "rgb(255, 171, 186)",
                img: "assets/friends/profile-image-louis.png",
                name: "Louis", breed: "Rabbit", country: "France",
                flag: "assets/friends/france.png"
            };
            this.maxDog = {
                bg: "rgb(255, 216, 171)",
                img: "assets/friends/profile-image-max.png",
                name: "Max", breed: "Shepherd", country: "Germany",
                flag: "assets/friends/germany.png"
            };
            this.sniezka = {
                bg: "rgb(171, 219, 255)",
                img: "assets/friends/profile-image-sniezka.png",
                name: "Śnieżka", breed: "Hamster", country: "Poland",
                flag: "assets/friends/poland.png",
                width: 27
            };
            this.kumar = {
                bg: "rgb(255, 216, 171)",
                img: "assets/friends/profile-image-kumar.png",
                name: "Kumar", breed: "Tibetan Mastiff", country: "India",
                flag: "assets/friends/india.png"
            };
            this.jamilia = {
                bg: "rgb(175, 255, 226)",
                img: "assets/friends/profile-image-jamilia.png",
                name: "Jamilia", breed: "Arabian Mau", country: "Egypt",
                flag: "assets/friends/egypt.png"
            };
            this.jose = {
                bg: "rgb(171, 219, 255)",
                img: "assets/friends/profile-image-jose.png",
                name: "José", breed: "Ara Parrot", country: "Brazil",
                flag: "assets/friends/brazil.png"
            };
            this.sagwa = {
                bg: "rgb(255, 247, 171)",
                img: "assets/friends/profile-image-sagwa.png",
                name: "Sagwa", breed: "Siamese Cat", country: "China",
                flag: "assets/friends/china.png"
            };
            this.jambo = {
                bg: "rgb(178, 255, 171)",
                img: "assets/friends/profile-image-jambo.png",
                name: "Jambo", breed: "Ridgeback", country: "RSA",
                flag: "assets/friends/rsa.png"
            };
            // <--CONSTANTS

            // MESSAGES-->
            this.missingIdMsg = (id) => {
                return `${thePage} ${theElement} ${id} is missing in the body of the HTML document.`;
            };
            this.wrongTagMsg = (id, tag, tagAlt) => {
                if (tagAlt) return `${thePage} ${theElement} ${id} should be a/an ${tag} or ${tagAlt} tag.`;
                else return `${thePage} ${theElement} ${id} should be a/an ${tag} tag.`;
            };
            this.topBottomMsg = (id, pos) => {
                return `${thePage} ${theElement} ${id} should be at the ${pos} of the page.`;
            };
            this.wrongWidthMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s width seems a bit out of proportion. ${checkFigma}`;
            };
            this.wrongPositionMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s position seems a bit off. ${checkFigma}`;
            };
            this.widthLessThanMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1}'s width should be less than ${theElement} ${id2}.`;
            };
            this.wrongStyleMsg = (id, style) => {
                return `${thePage} ${theElement} ${id}'s ${style} is different from the Figma designs.`;
            };
            this.wrongParentMsg = (id, parentId) => {
                return `${thePage} ${theElement} ${id} should be a child of ${theElement} ${parentId}.`;
            };
            this.wrongAttributeMsg = (id, attribute, value) => {
                if (value) return `${thePage} ${theElement} ${id} should have the attribute "${attribute}" with the value of "${value}".`;
                return `${thePage} ${theElement} ${id} should have the attribute "${attribute}".`;
            };
            this.wrongTextMsg = (id) => {
                return `${thePage} ${theElement} ${id}'s text is different from the Figma designs.`;
            };
            this.wrongPositionCompareXMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1} should be on the left of ${theElement} ${id2}.`;
            };
            this.wrongPositionCompareYMsg = (id1, id2) => {
                return `${thePage} ${theElement} ${id1} should be above ${theElement} ${id2}.`;
            };
            this.missingOptionMsg = (id) => {
                return `${thePage} ${theElement} ${id} should have at least one option.`;
            };
            // <--MESSAGES
            return correct();

        }),
        this.node.execute(async () => {
            // test #11
            // set viewport page2
            await this.page2.open()
            await this.page2.setViewport({width: 1200, height: 825})

            return correct()
        }),
        this.page2.execute(() => {
            // test #12
            // STAGE3 FRIENDS TAGS EXIST

            // check if element with id #Navbar exists
            let idNavbar = "#navbar";
            if (this.elementExists(idNavbar)) return wrong(this.missingIdMsg(idNavbar));

            // check the tag of element with id #Navbar
            if (this.elementExists(idNavbar, ["nav", "header"]))
                return wrong(this.wrongTagMsg(idNavbar, "nav", "header"));

            // check if element with id #filter-bar exists
            let idFilterBar = "#filter-bar";
            if (this.elementExists(idFilterBar)) return wrong(this.missingIdMsg(idFilterBar));

            // check the tag of element with id #filter-bar
            if (this.elementExists(idFilterBar, ["aside"]))
                return wrong(this.wrongTagMsg(idFilterBar, "aside"));

            // check if element with id #friends-cards exists
            let idFriendsCards = "#friends-cards";
            if (this.elementExists(idFriendsCards)) return wrong(this.missingIdMsg(idFriendsCards));

            // check the tag of element with id #friends-cards
            if (this.elementExists(idFriendsCards, ["section"]))
                return wrong(this.wrongTagMsg(idFriendsCards, "section"));

            // check if element with id #Footer exists
            let idFooter = "#footer";
            if (this.elementExists(idFooter)) return wrong(this.missingIdMsg(idFooter));

            // check the tag of element with id #Footer
            if (this.elementExists(idFooter, ["footer"]))
                return wrong(this.wrongTagMsg(idFooter, "footer"));

            return correct();

        }),
        this.page2.execute(() => {
            // test #13
            // STAGE3 FRIENDS PAGE POSITION

            // check if element with #filter-bar is on top of #friends-cards
            let idFilterBar = "#filter-bar";
            let idFriendsCards = "#friends-cards";
            if (this.elementPositionCompareY(idFilterBar, idFriendsCards))
                return wrong(this.wrongPositionCompareYMsg(idFilterBar, idFriendsCards));

            return correct()
        }),
        this.page2.execute(() => {
            // test #14
            // STAGE3 FRIENDS PAGE CSS PROPERTIES

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
            let idFilterBar = "#filter-bar";
            bgColor = "rgba(171, 219, 255, 0.25)";
            if (this.elementStyle(idFilterBar, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idFilterBar, this.bg));

            // check if element with id #description has correct background color
            let idFriendsCards = "#friends-cards";
            bgColor = "rgba(171, 219, 255, 0.5)";
            if (this.elementStyle(idFriendsCards, this.bg, bgColor))
                return wrong(this.wrongStyleMsg(idFriendsCards, this.bg));

            // check if element with id #profile-card has correct border-radius
            let correctBorderRadius = "24px";
            if (this.elementStyle(idFilterBar, this.radius, correctBorderRadius))
                return wrong(this.wrongStyleMsg(idFilterBar, this.radius));

            // check if element with id #description has correct border-radius
            if (this.elementStyle(idFriendsCards, this.radius, correctBorderRadius))
                return wrong(this.wrongStyleMsg(idFriendsCards, this.radius));

            // check if element with id #profile-card has correct box-shadow
            let correctBoxShadow = "rgba(0, 0, 0, 0.25) 0px 5px 5px 0px";
            if (this.elementStyle(idFilterBar, this.shadow, correctBoxShadow))
                return wrong(this.wrongStyleMsg(idFilterBar, this.shadow));

            // check if element with id #description has correct box-shadow
            if (this.elementStyle(idFriendsCards, this.shadow, correctBoxShadow))
                return wrong(this.wrongStyleMsg(idFriendsCards, this.shadow));

            return correct()
        }),
        this.page2.execute(() => {
            // test #15
            // STAGE3 Navbar Elements
            const idNavbar = "#navbar";
            const idPetProfileLink = "#pet-profile-link";
            const idFriendsLink = "#friends-link";
            const idSettingsLink = "#settings-link";

            // #logo
            // check if element with id #logo exist
            let idLogo = "#logo";
            if (this.elementExists(idLogo)) return wrong(this.missingIdMsg(idLogo));

            // check if element with id #logo has correct tag
            if (this.elementExists(idLogo, ["img"]))
                return wrong(this.wrongTagMsg(idLogo, "img"));

            // check if element with id #logo is in #Navbar
            if (this.elementHasParent(idLogo, idNavbar))
                return wrong(this.wrongParentMsg(idLogo, idNavbar));

            // check if element with id #logo has correct src
            let correctSrc = "assets/navbar/logo.png";
            if (this.elementHasAttribute(idLogo, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idLogo, "src", correctSrc));

            // check if element with id #logo has alt
            if (this.elementHasAttribute(idLogo, "alt"))
                return wrong(this.wrongAttributeMsg(idLogo, "alt"));

            // #pet-profile
            // check if element with id #pet-profile exist
            let idPetProfile = "#pet-profile";
            if (this.elementExists(idPetProfile))
                return wrong(this.missingIdMsg(idPetProfile));

            // check if element with id #pet-profile has correct tag
            if (this.elementExists(idPetProfile, ["img"]))
                return wrong(this.wrongTagMsg(idPetProfile, "img"));

            // check if element with id #pet-profile is in #pet-profile-link
            if (this.elementHasParent(idPetProfile, idPetProfileLink))
                return wrong(this.wrongParentMsg(idPetProfile, idPetProfileLink));

            // check if element with id #pet-profile has correct src
            correctSrc = "assets/navbar/pet-profile.png";
            if (this.elementHasAttribute(idPetProfile, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idPetProfile, "src", correctSrc));

            // check if element with id #pet-profile has alt
            if (this.elementHasAttribute(idPetProfile, "alt"))
                return wrong(this.wrongAttributeMsg(idPetProfile, "alt"));

            // #friends
            // check if element with id #friends exist
            let idFriends = "#friends";
            if (this.elementExists(idFriends))
                return wrong(this.missingIdMsg(idFriends));

            // check if element with id #friends has correct tag
            if (this.elementExists(idFriends, ["img"]))
                return wrong(this.wrongTagMsg(idFriends, "img"));

            // check if element with id #friends is in #friends-link
            if (this.elementHasParent(idFriends, idFriendsLink))
                return wrong(this.wrongParentMsg(idFriends, idFriendsLink));

            // check if element with id #friends has correct src
            correctSrc = "assets/navbar/friends.png";
            if (this.elementHasAttribute(idFriends, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idFriends, "src", correctSrc));

            // check if element with id #friends has alt
            if (this.elementHasAttribute(idFriends, "alt"))
                return wrong(this.wrongAttributeMsg(idFriends, "alt"));

            // #settings
            // check if element with id #settings exist
            let idSettings = "#settings";
            if (this.elementExists(idSettings))
                return wrong(this.missingIdMsg(idSettings));

            // check if element with id #settings has correct tag
            if (this.elementExists(idSettings, ["img"]))
                return wrong(this.wrongTagMsg(idSettings, "img"));

            // check if element with id #settings is in #settings-link
            if (this.elementHasParent(idSettings, idSettingsLink))
                return wrong(this.wrongParentMsg(idSettings, idSettingsLink));

            // check if element with id #settings has correct src
            correctSrc = "assets/navbar/settings.png";
            if (this.elementHasAttribute(idSettings, "src", correctSrc))
                return wrong(this.wrongAttributeMsg(idSettings, "src", correctSrc));

            // check if element with id #settings has alt
            if (this.elementHasAttribute(idSettings, "alt"))
                return wrong(this.wrongAttributeMsg(idSettings, "alt"));

            // #pet-profile-link
            // check if element with id #pet-profile-link exist
            if (this.elementExists(idPetProfileLink))
                return wrong(this.missingIdMsg(idPetProfileLink));

            // check if element with id #pet-profile-link has correct tag
            if (this.elementExists(idPetProfileLink, ["a"]))
                return wrong(this.wrongTagMsg(idPetProfileLink, "a"));

            // check if element with id #pet-profile-link is in #Navbar
            if (this.elementHasParent(idPetProfileLink, idNavbar))
                return wrong(this.wrongParentMsg(idPetProfileLink, idNavbar));

            // check if element with id #pet-profile-link has correct href
            let correctHref = "profile.html";
            if (this.elementHasAttribute(idPetProfileLink, "href", correctHref, false))
                return wrong(this.wrongAttributeMsg(idPetProfileLink, "href", correctHref));

            // check if element with id #pet-profile-link has correct text-decoration
            if (this.elementStyle(idPetProfileLink, "text-decoration-line", "none"))
                return wrong(this.wrongStyleMsg(idPetProfileLink, "text-decoration", "none"));

            // check if element with id #pet-profile-link is on the left of #friends-link
            if (this.elementPositionCompareX(idPetProfileLink, idFriendsLink))
                return wrong(this.wrongPositionCompareXMsg(idPetProfileLink, idFriendsLink));

            // #friends-link
            // check if element with id #friends-link exist
            if (this.elementExists(idFriendsLink))
                return wrong(this.missingIdMsg(idFriendsLink));

            // check if element with id #friends-link has correct tag
            if (this.elementExists(idFriendsLink, ["a"]))
                return wrong(this.wrongTagMsg(idFriendsLink, "a"));

            // check if element with id #friends-link is in #navbar
            if (this.elementHasParent(idFriendsLink, idNavbar))
                return wrong(this.wrongParentMsg(idFriendsLink, idNavbar));

            // check if element with id #friends-link is on the left of #settings-link
            if (this.elementPositionCompareX(idFriendsLink, idSettingsLink))
                return wrong(this.wrongPositionCompareXMsg(idFriendsLink, idSettingsLink));

            // check if element with id #friends-link has href
            correctHref = "friends.html";
            if (this.elementHasAttribute(idFriendsLink, "href", correctHref, false))
                return wrong(this.wrongAttributeMsg(idFriendsLink, "href", correctHref));

            // #settings-link
            // check if element with id #settings-link exist
            if (this.elementExists(idSettingsLink))
                return wrong(this.missingIdMsg(idSettingsLink));

            // check if element with id #settings-link has correct tag
            if (this.elementExists(idSettingsLink, ["a"]))
                return wrong(this.wrongTagMsg(idSettingsLink, "a"));

            // check if element with id #settings-link is in #Navbar
            if (this.elementHasParent(idSettingsLink, idNavbar))
                return wrong(this.wrongParentMsg(idSettingsLink, idNavbar));

            return correct()
        }),
        this.page2.execute(() => {
            // test #16
            // STAGE3 Footer Elements
            const idFooter = "#footer";

            // #footer-text
            // check if element with id #footer-text exist
            let idFooterText = "#footer-text";
            if (this.elementExists(idFooterText))
                return wrong(this.missingIdMsg(idFooterText));

            // check if element with id #footer-text has correct tag
            if (this.elementExists(idFooterText, ["p", "span"]))
                return wrong(this.wrongTagMsg(idFooterText, "span", "p"));

            // check if element with id #footer-text is in #Footer
            if (this.elementHasParent(idFooterText, idFooter))
                return wrong(this.wrongParentMsg(idFooterText, idFooter));

            // check if element with id #footer-text has correct text
            let correctText = "© Petbook | All Rights Reserved";
            if (this.elementHasText(idFooterText, correctText))
                return wrong(this.wrongTextMsg(idFooterText, correctText));

            // check if element with id #footer-text has correct color
            if (this.elementStyle(idFooterText, "color", "rgb(255, 255, 255)"))
                return wrong(this.wrongStyleMsg(idFooterText, "color"));

            // #facebook
            // check if element with id #facebook exist
            let idFacebook = "#facebook";
            if (this.elementExists(idFacebook))
                return wrong(this.missingIdMsg(idFacebook));

            // check if element with id #facebook has correct tag
            if (this.elementExists(idFacebook, ["svg"]))
                return wrong(this.wrongTagMsg(idFacebook, "svg"));

            // check if element with id #facebook is in #footer
            if (this.elementHasParent(idFacebook, idFooter))
                return wrong(this.wrongParentMsg(idFacebook, idFooter));

            // #twitter
            // check if element with id #twitter exist
            let idTwitter = "#twitter";
            if (this.elementExists(idTwitter))
                return wrong(this.missingIdMsg(idTwitter));

            // check if element with id #twitter has correct tag
            if (this.elementExists(idTwitter, ["svg"]))
                return wrong(this.wrongTagMsg(idTwitter, "svg"));

            // check if element with id #twitter is in #footer
            if (this.elementHasParent(idTwitter, idFooter))
                return wrong(this.wrongParentMsg(idTwitter, idFooter));

            // check if element with id #facebook is on left of #twitter
            if (this.elementPositionCompareX(idFacebook, idTwitter))
                return wrong(this.wrongPositionCompareXMsg(idFacebook, idTwitter));

            // #instagram
            // check if element with id #instagram exist
            let idInstagram = "#instagram";
            if (this.elementExists(idInstagram))
                return wrong(this.missingIdMsg(idInstagram));

            // check if element with id #instagram has correct tag
            if (this.elementExists(idInstagram, ["svg"]))
                return wrong(this.wrongTagMsg(idInstagram, "svg"));

            // check if element with id #instagram is in #footer
            if (this.elementHasParent(idInstagram, idFooter))
                return wrong(this.wrongParentMsg(idInstagram, idFooter));

            // check if element with id #twitter is on left of #instagram
            if (this.elementPositionCompareX(idTwitter, idInstagram))
                return wrong(this.wrongPositionCompareXMsg(idTwitter, idInstagram));

            return correct();
        }),
        this.page2.execute(() => {
            // test #17
            // STAGE3 - ASIDE #filter-bar
            const idFilterBar = "#filter-bar";
            let correctText = "Find new friends!";

            //  #friends-header
            let idFriendsHeader = "#friends-header";
            if (this.multipleChecks(idFriendsHeader, idFilterBar, correctText, this.px24, "28.8px", "rgb(58, 172, 255)", ["h1", "h2"]))
                return wrong(this.multipleChecks(idFriendsHeader, idFilterBar, correctText, this.px24, "28.8px", "rgb(58, 172, 255)", ["h1", "h2"]));

            // #filter-text
            let idFilterText = "#filter-text";
            correctText = "Filter";
            if (this.multipleChecks(idFilterText, idFilterBar, correctText, "12px", "14.4px", "rgb(58, 172, 255)", ["span", "p"]))
                return wrong(this.multipleChecks(idFilterText, idFilterBar, correctText, "12px", "14.4px", "rgb(58, 172, 255)", ["span", "p"]));

            // #filter-select-animal
            let idFilterSelectAnimal = "#filter-select-animal";
            if (this.selectMultipleChecks(idFilterSelectAnimal, idFilterBar))
                return wrong(this.selectMultipleChecks(idFilterSelectAnimal, idFilterBar));

            // #filter-select-animal is on the right side of #filter-text
            if (this.elementPositionCompareX(idFilterText, idFilterSelectAnimal))
                return wrong(this.wrongPositionCompareXMsg(idFilterText, idFilterSelectAnimal));

            //  #filter-select-animal option
            let idFilterSelectAnimalOption = "#filter-select-animal option";
            if (this.elementExists(idFilterSelectAnimalOption))
                return wrong(this.missingOptionMsg(idFilterSelectAnimal));

            correctText = "Animal";
            if (this.elementHasText(idFilterSelectAnimalOption, correctText))
                return wrong(this.wrongTextMsg(idFilterSelectAnimalOption));

            // #filter-select-breed
            let idFilterSelectBreed = "#filter-select-breed";
            if (this.selectMultipleChecks(idFilterSelectBreed, idFilterBar))
                return wrong(this.selectMultipleChecks(idFilterSelectBreed, idFilterBar));

            // #filter-select-breed is on the right side of #filter-select-animal
            if (this.elementPositionCompareX(idFilterSelectAnimal, idFilterSelectBreed))
                return wrong(this.wrongPositionCompareXMsg(idFilterSelectAnimal, idFilterSelectBreed));

            // #filter-select-breed option
            let idFilterSelectBreedOption = "#filter-select-breed option";
            if (this.elementExists(idFilterSelectBreedOption))
                return wrong(this.missingOptionMsg(idFilterSelectBreed));

            correctText = "Breed";
            if (this.elementHasText(idFilterSelectBreedOption, correctText))
                return wrong(this.wrongTextMsg(idFilterSelectBreedOption));

            // #filter-select-country
            let idFilterSelectCountry = "#filter-select-country";
            if (this.selectMultipleChecks(idFilterSelectCountry, idFilterBar))
                return wrong(this.selectMultipleChecks(idFilterSelectCountry, idFilterBar));

            // #filter-select-country is on the right side of #filter-select-breed
            if (this.elementPositionCompareX(idFilterSelectBreed, idFilterSelectCountry))
                return wrong(this.wrongPositionCompareXMsg(idFilterSelectBreed, idFilterSelectCountry));

            // #filter-select-country option
            let idFilterSelectCountryOption = "#filter-select-country option";
            if (this.elementExists(idFilterSelectCountryOption))
                return wrong(this.missingOptionMsg(idFilterSelectCountry));

            correctText = "Country";
            if (this.elementHasText(idFilterSelectCountryOption, correctText))
                return wrong(this.wrongTextMsg(idFilterSelectCountryOption));

            return correct();
        }),
        this.page2.execute(() => {
            // test #18
            // STAGE3 - SECTION #friends-cards
            let idFriendsCards = "#friends-cards";

            // #friend-card-micky multiple checks
            let idFriendCardMicky = "#friend-card-micky";
            if (this.friendCardMultipleChecks(idFriendCardMicky, idFriendsCards, this.micky.bg, this.micky.img, this.micky.name, this.micky.flag, this.micky.breed, this.micky.country))
                return wrong(this.friendCardMultipleChecks(idFriendCardMicky, idFriendsCards, this.micky.bg, this.micky.img, this.micky.name, this.micky.flag, this.micky.breed, this.micky.country));

            // #friend-card-browny multiple checks
            let idFriendCardBrowny = "#friend-card-browny";
            if (this.friendCardMultipleChecks(idFriendCardBrowny, idFriendsCards, this.browny.bg, this.browny.img, this.browny.name, this.browny.flag, this.browny.breed, this.browny.country))
                return wrong(this.friendCardMultipleChecks(idFriendCardBrowny, idFriendsCards, this.browny.bg, this.browny.img, this.browny.name, this.browny.flag, this.browny.breed, this.browny.country));

            // #friend-card-kumar multiple checks
            let idFriendCardKumar = "#friend-card-kumar";
            if (this.friendCardMultipleChecks(idFriendCardKumar, idFriendsCards, this.kumar.bg, this.kumar.img, this.kumar.name, this.kumar.flag, this.kumar.breed, this.kumar.country))
                return wrong(this.friendCardMultipleChecks(idFriendCardKumar, idFriendsCards, this.kumar.bg, this.kumar.img, this.kumar.name, this.kumar.flag, this.kumar.breed, this.kumar.country));

            // #friend-card-jamilia multiple checks
            let idFriendCardJamilia = "#friend-card-jamilia";
            if (this.friendCardMultipleChecks(idFriendCardJamilia, idFriendsCards, this.jamilia.bg, this.jamilia.img, this.jamilia.name, this.jamilia.flag, this.jamilia.breed, this.jamilia.country))
                return wrong(this.friendCardMultipleChecks(idFriendCardJamilia, idFriendsCards, this.jamilia.bg, this.jamilia.img, this.jamilia.name, this.jamilia.flag, this.jamilia.breed, this.jamilia.country));

            // check if #friend-card-micky is on the left of #friend-card-browny
            if (this.elementPositionCompareX(idFriendCardMicky, idFriendCardBrowny))
                return wrong(this.wrongPositionCompareXMsg(idFriendCardMicky, idFriendCardBrowny));

            // check if #friend-card-micky is on the top of #friend-card-kumar
            if (this.elementPositionCompareY(idFriendCardMicky, idFriendCardKumar))
                return wrong(this.wrongPositionCompareYMsg(idFriendCardMicky, idFriendCardKumar));

            // check if #friend-card-browny is on the top of #friend-card-jamilia
            if (this.elementPositionCompareY(idFriendCardBrowny, idFriendCardJamilia))
                return wrong(this.wrongPositionCompareYMsg(idFriendCardBrowny, idFriendCardJamilia));

            // check if #friend-card-kumar is on the left of #friend-card-jamilia
            if (this.elementPositionCompareX(idFriendCardKumar, idFriendCardJamilia))
                return wrong(this.wrongPositionCompareXMsg(idFriendCardKumar, idFriendCardJamilia));

            return correct();
        })
    ]
}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);