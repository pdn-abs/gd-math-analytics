# UAT Procedure Documentation

## Overview
User Acceptance Testing (UAT) is typically conducted one week before each release to validate tasks and levels for the upcoming build.

## Pre-UAT Preparation
1. **Gather UAT tasks**: Filter all the "UAT Listed" tasks.
2. **Ensure completeness**: Verify that all tasks related to the current release are marked as "UAT Listed." If any tasks are in "TEST - Completed" but belong to this release, update their status to "UAT Listed".
3. **Exclude non-manual tasks**: Among the UAT-listed tasks, identify those that cannot be tested manually by users or do not require UAT. Mark these as "Test Archived" or "UAT Archived" based on their nature.
4. **Curate levels**: From the remaining tasks, compile a list of levels (titles) that need to undergo UAT. Newly configured levels for the release will already be tagged by testers with a version tag in the config sheet, and in the UAT build, these new levels will appear separately under the level list called "New Levels".
5. **Plan sessions**: Based on the number of levels to test, schedule one or more UAT sessions, each lasting 60–90 minutes.
6. **Notify participants**: Inform UAT participants at least one day in advance about the session schedule and agenda.
7. **Prepare materials**:
   - Ensure a UAT build is ready for testing.
8. **Record sessions**: Every UAT session must be recorded, and the recording link added to each feedback entry in the UAT feedback sheet.

## UAT Session Procedure
1. **Distribute build**: Provide testers with the latest UAT build link for installation.
2. **Assign levels**: Split the levels to be tested among testers and share them the level titles.
3. **Conduct testing**: Testers play the assigned levels and share feedback in real-time.
4. **Document feedback**: Note each feedback item with the tester's name or ID, timestamp, and details. Encourage screen sharing for clarity.
5. **Escalate issues**: Immediately inform the project manager of any major bugs.
6. **End on time**: Close sessions promptly at the scheduled duration.

## Post-UAT Actions
1. **Enter feedback**: Record all collected feedback in the UAT feedback sheet.
2. **Triage and update**: Align with stakeholders (e.g., VC, KPK) on feedback and update statuses accordingly.
3. **Move passed tasks**: Tasks that successfully pass UAT should be moved to "Release-Listed," and the "Depends on" field updated to the release owner (e.g., SRDJ).
4. **Create follow-up tasks**: For feedback marked as "Planned" (decided to fix), add new tasks and assign owners.

## Notes and Best Practices
- Use consistent terminology throughout.
- Keep feedback concise and actionable.
- Timestamp all entries for traceability.
- Encourage screen sharing during feedback sessions for better context.
