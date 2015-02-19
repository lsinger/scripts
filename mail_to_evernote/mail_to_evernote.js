#!/usr/bin/env osascript -l JavaScript

var EVERNOTE = "your.evernote@email.address";
var LIMIT = 240; // evernote has a limit of 250 incoming emails per day
var ACCOUNT = "private account"; // the account to which you want to archive
var ARCHIVE = "INBOX/Archive"; // the archive folder of the above account
var FLAG_TO_MOVE = 2; // the flag to move

function run(argv) {
    mail = Application("com.apple.Mail")
    archive = mail.accounts.byName(ACCOUNT).mailboxes.byName(ARCHIVE);
    var processed = 0;
    for (i = mail.inbox.messages.length-1 ; i >= 0 ; i--) {
      if ( processed >= LIMIT ) {
        console.log("stopping. processed: " + processed + "; LIMIT: " + LIMIT);
        break;
      }

      // only process those flagged the way we defined above
      message = mail.inbox.messages[i];
      if ( message.flagIndex() !== FLAG_TO_MOVE ) {
        continue;
      }

      // forward message to evernote
      outgoing = message.redirect();
      outgoing.toRecipients.push(mail.Recipient({ address: EVERNOTE }))
      var success = outgoing.send();
      if ( !success ) {
        console.log(message.flagIndex() + " " + mail.inbox.messages[i].subject());
        console.log("ERROR: couldn't send that one!");
        break;
      }
      outgoing.close({saving: 'no'});
      // unflag and archive the original message
      try {
        message.flaggedStatus = false;
        message.mailbox = archive;
      } catch (e) {
        console.log("failed to unflag and archive a message, please do so manually: " + mail.inbox.messages[i].subject());
        console.log(e);
      }
      processed++;
      console.log(processed + ": " + mail.inbox.messages[i].subject());
    }
}