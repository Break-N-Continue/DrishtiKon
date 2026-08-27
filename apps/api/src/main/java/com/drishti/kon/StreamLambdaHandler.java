package com.drishti.kon;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.serverless.proxy.spring.SpringBootProxyHandlerBuilder;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import org.crac.Core;
import org.crac.Resource;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * AWS Lambda entry point for the DrishtiKon Spring Boot API.
 *
 * <p>Uses the AWS Serverless Java Container to adapt HTTP API Gateway
 * proxy requests into standard Spring MVC requests, forwarding them to
 * the existing controllers without any controller-level code changes.
 *
 * <p>Implements {@link org.crac.Resource} to support AWS Lambda SnapStart,
 * which pre-warms the JVM/Spring context at deploy time and eliminates
 * cold-start penalty entirely.
 */
public class StreamLambdaHandler implements RequestStreamHandler, Resource {

    private static final SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

    static {
        try {
            handler = new SpringBootProxyHandlerBuilder<AwsProxyRequest>()
                    .defaultProxy()
                    .asyncInit()
                    .springBootApplication(DrishtiKonApplication.class)
                    .buildAndInitialize();
        } catch (ContainerInitializationException e) {
            throw new RuntimeException("Could not initialize Spring Boot application", e);
        }
    }

    public StreamLambdaHandler() {
        // Register this instance with CRaC to support Lambda SnapStart
        Core.getGlobalContext().register(this);
    }

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context)
            throws IOException {
        handler.proxyStream(inputStream, outputStream, context);
    }

    @Override
    public void beforeCheckpoint(org.crac.Context<? extends Resource> context) throws Exception {
        // Called by Lambda SnapStart before taking the memory snapshot.
        // Spring context is already initialized in the static block above.
    }

    @Override
    public void afterRestore(org.crac.Context<? extends Resource> context) throws Exception {
        // Called by Lambda SnapStart after restoring from the snapshot.
        // Re-warm connections or caches here if needed.
    }
}
