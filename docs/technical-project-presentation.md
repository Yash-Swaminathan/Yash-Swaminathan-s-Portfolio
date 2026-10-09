# Technical project presentation

ChatterBox and termshare use a concise overview, repository/setup links, a primary architecture diagram, and optional native disclosure sections for deeper reading. This implements the owner's approved 2026-10-09 direction after reviewing their ChatterBox Architecture PDF.

The diagrams borrow the reference's visual organization: a grouped process boundary, labeled links, restrained colors, and monospaced technical annotations. They are reconstructed as SVG rather than embedding the PDF, which contains clipped horizontally scrollable content and print headers. Smaller screens can pan within the diagram or open the original SVG. Other projects retain their existing presentation.

ChatterBox's topology represents the repository's documented single-instance deployment model, not a verified live deployment. Its optional uploads and out-of-band notification services are shown separately. The collapsed sections describe the persistence/broadcast order, core relational model, Redis responsibilities, notification trade-offs, and single-process constraints. Details were checked against source, including the Dockerfile, message handler, notification services, and deployment guide.

termshare's diagram remains smaller in scope: browser terminals, Go session handling, PTY, and shell. Permission checks, scrollback/slow-client handling, and trusted-network limitations live in the expandable sections. No unsupported demo link or performance claim is added.
