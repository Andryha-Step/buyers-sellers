const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail')
admin.initializeApp();

const db = admin.database();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.sendEmail = functions.database.ref('InterestedUsers/{propID}/userId/{interestID}')
    .onCreate(async (snap, context) => {
        
        const { buyerId } = snap.val();
        
        db.ref(`AllSellerHomes/${ context.params.propID }`).once('value', propSnap => {
            db.ref().child(`users/${ buyerId }`).once('value', buyerSnap => {
                db.ref().child(`users/${ propSnap.val().sellerId }`).once('value', sellerSnap => {
                    const property = propSnap.val()
                    const buyer = buyerSnap.val()
                    const seller = sellerSnap.val()

                    sgMail.setApiKey('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')
                    const msg = {
                        to: ['logan@versantrealestategroup.com', 'david@versantrealestategroup.com', 'eloninfo2@gmail.com'], 
                        // to: 'eloninfo2@gmail.com',
                        from: 'datingbuyerssellers@gmail.com', 
                        template_id: 'd-87388049dca94192a89f1555b18b87af',
                        dynamic_template_data: {
                            buyer_name: `${buyer.firstName || '[Error getting name from database]'} ${buyer.lastName || ''}`,
                            address: property.address,
                            seller_name: `${seller.firstName || '[Error getting name from database]'} ${seller.lastName || ''}`,
                        }
                    }
                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log('Email sent')
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                })
            })
        })
    });