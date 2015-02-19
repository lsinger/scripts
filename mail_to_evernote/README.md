Uses JXA / JavaScript for Automation (available on Mac OS X Yosemite) to go through your Apple Mail inbox, looks for messages flagged with a certain flag, forwards them to your Evernote email address, and finally unflags and archives them.

Configure the following before use:

```
var EVERNOTE = "your.evernote@email.address";
var LIMIT = 240; // evernote has a limit of 250 incoming emails per day
var ACCOUNT = "private account"; // the account to which you want to archive
var ARCHIVE = "INBOX/Archive"; // the archive folder of the above account
var FLAG_TO_MOVE = 2; // the flag to move
```

To figure out the values for `ACCOUNT`, `ARCHIVE`, and `FLAG_TO_MOVE` you can use `osascript -il JavaScript` for exploration. This starts a JXA REPL. Explore Mail as follows:

```
>> mail = Application("com.apple.Mail")
=> Application("Mail")
>> mail.accounts()
=> [Application("Mail").accounts.byName("iCloud")]
>> mail.accounts.byName("iCloud").mailboxes()
=> [Application("Mail").accounts.byName("iCloud").mailboxes.byName("INBOX/Drafts"), Application("Mail").accounts.byName("iCloud").mailboxes.byName("INBOX/Junk"), Application("Mail").accounts.byName("iCloud").mailboxes.byName("INBOX/Trash"), Application("Mail").accounts.byName("iCloud").mailboxes.byName("INBOX"), Application("Mail").accounts.byName("iCloud").mailboxes.byName("INBOX/Archive")]
```

To figure out which flag you want, look at messages from a mailbox like so:

Subject: `mail.inbox.messages[0].subject()`

Flag Index: `mail.inbox.messages[0].flagIndex()`

The flag index seems to be 0-based and reflect the order in the UI, though. So the red flag should be 0, orange is 1, yellow is 2, and so on.

Before you can run the script, it needs to be made executable: `chmod +x mail_to_evernote.js`

Usage:
	./mail_to_evernote.js

JXA seems to randomly throw exceptions sometimes (not unflagging, not archiving, not closing the windows of sent messages, ...), so unfortunately to be really save this worked, you would need to manually go through any remains in Mail (messages still flagged, message windows not closed).
