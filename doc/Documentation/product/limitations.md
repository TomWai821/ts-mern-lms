## Current Limitations

### Summary
- These limitations represent conscious trade-offs made to prioritise rapid prototyping and architectural exploration

- Core business workflows are fully functional, while production-oriented concerns such as advanced security controls, broader test coverage, and scalability enhancements remain part of the future roadmap

### Architecture
- The current data model prioritises rapid prototyping over query efficiency, resulting in additional cross-collection lookups for some workflows
- Certain query implementations rely on aggregation pipelines where simpler alternatives could improve maintainability

### Testing
- Integration and end-to-end test coverage remains limited due to project scope

### Operations
- QR-code-based workflows currently require manual data entry or external scanning devices