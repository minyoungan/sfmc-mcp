(function () {

    const pageExitMillis = 50;

    /**
     * @function buildBindId
     * @param {Object} context
     * @description Create unique bind ID based on the campaign and experience IDs.
     */
    function buildBindId(context) {
        return `${context.campaign}:${context.experience}`;
    }

    /**
     * @function setConfirmationPanel
     * @description Add click listener to the Call-To-Action button that validates the user email address,
     * shows the Confirmation Panel, removes dismissal tracking from the "X" button and overlay, and sends
     * an event to Interaction Studio to set the emailAddress attribute to the user email address.
     */
    function setConfirmationPanel() {
        SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture .evg-cta").on("click", () => {
            const emailAddress = SalesforceInteractions.cashDom(".evg-form input[placeholder='Email']").val();
           /* const firstname = SalesforceInteractions.cashDom(".evg-form input[placeholder='First Name']").val();
            const lastname = SalesforceInteractions.cashDom(".evg-form input[placeholder='Last Name']").val();*/
            const regex = RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/);
            if (emailAddress && regex.test(emailAddress)) {
                SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture .evg-main-panel").addClass("evg-hide");
                SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture .evg-confirm-panel").removeClass("evg-hide");
                SalesforceInteractions.cashDom(`
                    #evg-exit-intent-popup-email-capture .evg-overlay,
                    #evg-exit-intent-popup-email-capture .evg-btn-dismissal
                `).removeAttr("data-evg-dismissal");
                SalesforceInteractions.sendEvent({
                    interaction: {
                        name: "Popup Email Capture"
                    },
                    user: {
                        identities: {
                        emailAddress: emailAddress
                    },
                }
                });
            } else {
                SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture .evg-error-msg")
                    .removeClass("evg-hide")
                    .addClass("evg-error");
            }
        });
    }

    /**
     * @function setDismissal
     * @param {Object} context
     * @description Add click listener to the overlay, "X" button, and opt-out text that removes the
     * template from the DOM.
     */
    function setDismissal(context) {
        const dismissSelectors = `
            #evg-exit-intent-popup-email-capture .evg-overlay,
            #evg-exit-intent-popup-email-capture .evg-btn-dismissal,
            #evg-exit-intent-popup-email-capture .evg-opt-out-msg,
            #evg-exit-intent-popup-email-capture .evg-cta
        `;

        SalesforceInteractions.cashDom(dismissSelectors).on("click", () => {
            SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture").remove();
        });
    }

    function sendCampaignStatEvent(startType, experience) {
        const stat = {
            experienceId:`${experience}`,
            stat:startType,
            control:false,
        };
        SalesforceInteractions.mcis.sendStat({campaignStats:[stat]});
    }

    function apply(context, template) {
        if (!context.contentZone) return;

        /**
         * The pageExit method waits for the user's cursor to exit through the top edge of the page before rendering the
         * template after a set delay.
         *
         * Visit the Template Display Utilities documentation to learn more:
         * https://developer.salesforce.com/docs/marketing/personalization/guide/web-template-display-utilities
         */
        return SalesforceInteractions.DisplayUtils
            .bind(buildBindId(context))
            .pageInactive(pageExitMillis)
            .then(() => {
                if (SalesforceInteractions.cashDom("#evg-exit-intent-popup").length > 0) return;

                const html = template(context);
                SalesforceInteractions.cashDom("body").append(html);
                setConfirmationPanel();
                setDismissal(context);
                sendCampaignStatEvent("Impression",context.experience);

                const input = document.querySelector(".evg-form .evg-email")
                const btn = document.querySelector("#evg-exit-intent-popup-email-capture .evg-form .evg-btn-lg")
                if (input.val().trim !== "") {
                    btn.on('click', function () {
                        SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture").remove()
                    })
                }

            });
    }

    function reset(context, template) {
        SalesforceInteractions.DisplayUtils.unbind(buildBindId(context));
        SalesforceInteractions.cashDom("#evg-exit-intent-popup-email-capture").remove();
    }

    function control(context) {
        return SalesforceInteractions.DisplayUtils
            .bind(buildBindId(context))
            .pageExit(pageExitMillis)
            .then(() => {
                if (context.contentZone) return true;
            });
    }

    registerTemplate({
        apply: apply,
        reset: reset,
        control: control
    });

})();
