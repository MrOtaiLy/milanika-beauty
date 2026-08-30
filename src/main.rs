use axum::{http::HeaderValue, routing::get, Router};
use std::{env, net::SocketAddr, path::PathBuf};
use tower_http::{compression::CompressionLayer, services::ServeDir, set_header::SetResponseHeaderLayer};

async fn health() -> &'static str {
    "ok"
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let port = env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(10000);
    let address = SocketAddr::from(([0, 0, 0, 0], port));
    let public_dir = PathBuf::from("public");

    let app = Router::new()
        .route("/health", get(health))
        .fallback_service(ServeDir::new(public_dir))
        .layer(CompressionLayer::new())
        .layer(SetResponseHeaderLayer::if_not_present(
            axum::http::header::X_CONTENT_TYPE_OPTIONS,
            HeaderValue::from_static("nosniff"),
        ))
        .layer(SetResponseHeaderLayer::if_not_present(
            axum::http::header::REFERRER_POLICY,
            HeaderValue::from_static("strict-origin-when-cross-origin"),
        ))
        .layer(SetResponseHeaderLayer::if_not_present(
            axum::http::header::X_FRAME_OPTIONS,
            HeaderValue::from_static("SAMEORIGIN"),
        ));

    let listener = tokio::net::TcpListener::bind(address).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
