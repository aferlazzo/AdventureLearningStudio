\# Architectural Principles



These principles guide every design decision in Adventure Learning Studio.



\---



\# 1. The Studio Knows HOW



The Studio provides the tools.



It knows how to:



\- Create Adventures

\- Create Missions

\- Build Storyboards

\- Manage Artwork

\- Generate Comics

\- Publish websites

\- Export PDFs



The Studio never contains subject-matter knowledge.



\---



\# 2. The Adventure Knows WHAT



Each Adventure contains the content.



Examples include:



\- Driver Confidence Guide

\- Gardening Basics

\- Learning AI

\- Woodworking

\- Personal Finance



The Adventure defines what is being taught.



\---



\# 3. Authors Think in Adventures



Authors should never need to think about:



\- folders

\- filenames

\- JSON files

\- project structure



Instead they think about:



Adventure



↓



Mission



↓



Storyboard



↓



Comic



↓



Publish



The Studio should reflect that mental model.



\---



\# 4. Hide Complexity



Technology should remain behind the scenes.



The software should perform repetitive technical tasks automatically whenever possible.



\---



\# 5. Reusable Before Specialized



The Studio is a platform.



It should work for any educational subject.



Subject-specific knowledge belongs inside Adventures—not inside the Studio.



\---



\# 6. Build Only What Helps Authors



Every feature should answer one question:



Does this make it easier for an author to create a learning adventure?



If not, it probably does not belong.



\---



\# 7. Don't Over-Engineer



Solve today's problems well.



Generalize only after experience shows the need.



Keep the design simple whenever possible.



\---



\# 8. Preserve the Separation



The Studio knows HOW.



The Adventure knows WHAT.



That separation is the foundation of Adventure Learning Studio.

