package org.streampipes.wrapper.esper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public abstract class AbstractQueueRunnable<T> extends Thread {

  private static final Logger LOG = LoggerFactory.getLogger(AbstractQueueRunnable.class);

  protected BlockingQueue<T> queue;
  protected long closeAfter = 0;
  protected long currentTimestamp;
  protected boolean autoClose;
  private boolean running;

  public AbstractQueueRunnable(int maxQueueSize, int closeAfter) {
    queue = new ArrayBlockingQueue<>(maxQueueSize);
    this.autoClose = true;
    this.closeAfter = closeAfter * 1000;
    this.currentTimestamp = System.currentTimeMillis();
  }

  public AbstractQueueRunnable(int maxQueueSize) {
    queue = new ArrayBlockingQueue<T>(maxQueueSize);
    this.autoClose = false;
    this.currentTimestamp = System.currentTimeMillis();
  }

  @Override
  public void run() {
    running = true;
    while (running) {
      if (autoClose) {
        if (System.currentTimeMillis() - currentTimestamp > closeAfter) {
          break;
        }
      }
      try {
        T data = queue.take();
        currentTimestamp = System.currentTimeMillis();
        doNext(data);
      } catch (Exception e) {
        e.printStackTrace();
        if (e instanceof InterruptedException) {
          Thread.currentThread().interrupt();
        } else {
          e.printStackTrace();
        }
      }
    }
    LOG.info("Interrupted");
  }

  public void interrupt() {
    running = false;
  }

  public void add(T data) throws InterruptedException {
    if (data != null) {
      queue.put(data);
    }
  }

  protected abstract void doNext(T data) throws Exception;
}