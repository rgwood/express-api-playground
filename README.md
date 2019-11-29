Playing with Expressjs, SuperTest, various Node API things...

## OpenAPI/Swagger

Use speccy to serve docs: `npx speccy serve openapi-spec.yml`

## Clustering

Toggle `RunInClusterMode` to switch between single-core and multi-core operation. We do a naive Fibonacci computation in `/login` to simulate an expensive CPU-bound operation.

Load testing: `siege http://localhost:3000/login --time=10s`

Single-core:
```
Lifting the server siege...
Transactions:                    860 hits
Availability:                 100.00 %
Elapsed time:                   9.79 secs
Data transferred:               0.12 MB
Response time:                  0.28 secs
Transaction rate:              87.84 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   24.63
Successful transactions:         860
Failed transactions:               0
Longest transaction:            0.31
Shortest transaction:           0.03
```

Multi-core:
```
Lifting the server siege...
Transactions:                   2571 hits
Availability:                 100.00 %
Elapsed time:                   9.80 secs
Data transferred:               0.36 MB
Response time:                  0.09 secs
Transaction rate:             262.35 trans/sec
Throughput:                     0.04 MB/sec
Concurrency:                   24.83
Successful transactions:        2571
Failed transactions:               0
Longest transaction:            0.14
Shortest transaction:           0.02
```

This is on an quad-core MBP and my CPU goes to nearly 400%, but the speedup is only ~3x. Wonder where the overhead is.